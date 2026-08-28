const Reservation = require('../models/Reservation');
const Book = require('../models/Book');
const Notification = require('../models/Notification');
const ActivityLog = require('../models/ActivityLog');

// @desc    Reserve a book
// @route   POST /api/reservations
const reserveBook = async (req, res) => {
  try {
    const { bookId } = req.body;

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (book.availableCopies > 0) {
      return res.status(400).json({ message: 'Book is available. You can issue it directly.' });
    }

    // Check for existing active reservation
    const existingReservation = await Reservation.findOne({
      user: req.user._id,
      book: bookId,
      status: { $in: ['pending', 'ready'] },
    });

    if (existingReservation) {
      return res.status(400).json({ message: 'You already have an active reservation for this book.' });
    }

    // Get queue position
    const lastInQueue = await Reservation.findOne({ book: bookId, status: 'pending' })
      .sort('-queuePosition');
    const queuePosition = lastInQueue ? lastInQueue.queuePosition + 1 : 1;

    const reservation = await Reservation.create({
      user: req.user._id,
      book: bookId,
      queuePosition,
    });

    await Notification.create({
      user: req.user._id,
      title: 'Book Reserved',
      message: `"${book.title}" has been reserved. Queue position: #${queuePosition}.`,
      type: 'reservation',
    });

    const populated = await Reservation.findById(reservation._id)
      .populate('user', 'name email')
      .populate('book', 'title author coverImage');

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get my reservations (student)
// @route   GET /api/reservations/my
const getMyReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({ user: req.user._id })
      .populate('book', 'title author coverImage availableCopies')
      .sort('-createdAt');

    // Check for expired reservations
    const now = new Date();
    for (let r of reservations) {
      if (r.status === 'ready' && r.expiresAt && r.expiresAt < now) {
        r.status = 'expired';
        await r.save();
      }
    }

    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all reservations (admin)
// @route   GET /api/reservations
const getAllReservations = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status) query.status = status;

    const total = await Reservation.countDocuments(query);
    const reservations = await Reservation.find(query)
      .populate('user', 'name email department')
      .populate('book', 'title author isbn')
      .sort('-createdAt')
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    res.json({
      reservations,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel reservation
// @route   PUT /api/reservations/:id/cancel
const cancelReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id).populate('book', 'title');

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    // Students can only cancel their own reservations
    if (req.user.role !== 'admin' && reservation.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (!['pending', 'ready'].includes(reservation.status)) {
      return res.status(400).json({ message: 'Only active reservations can be cancelled' });
    }

    reservation.status = 'cancelled';
    await reservation.save();

    // Recalculate queue positions
    const remaining = await Reservation.find({
      book: reservation.book._id,
      status: 'pending',
    }).sort('queuePosition');

    for (let i = 0; i < remaining.length; i++) {
      remaining[i].queuePosition = i + 1;
      await remaining[i].save();
    }

    res.json({ message: 'Reservation cancelled', reservation });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { reserveBook, getMyReservations, getAllReservations, cancelReservation };
