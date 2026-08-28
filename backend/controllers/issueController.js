const Issue = require('../models/Issue');
const Book = require('../models/Book');
const Reservation = require('../models/Reservation');
const Notification = require('../models/Notification');
const ActivityLog = require('../models/ActivityLog');
const calculateFine = require('../utils/calculateFine');
const sendEmail = require('../utils/sendEmail');

// @desc    Issue a book
// @route   POST /api/issues
const issueBook = async (req, res) => {
  try {
    const { bookId, userId } = req.body;
    
    // Determine who is borrowing: admin can issue for any user, student issues for themselves
    const borrowerId = req.user.role === 'admin' && userId ? userId : req.user._id;

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (book.availableCopies <= 0) {
      return res.status(400).json({ message: 'No copies available. You can reserve this book.' });
    }

    // Check borrowing limit
    const maxBorrow = parseInt(process.env.MAX_BORROW_LIMIT) || 3;
    const activeIssues = await Issue.countDocuments({ user: borrowerId, status: 'issued' });
    if (activeIssues >= maxBorrow) {
      return res.status(400).json({ message: `Borrowing limit reached. Maximum ${maxBorrow} books allowed.` });
    }

    // Check duplicate active issue
    const existingIssue = await Issue.findOne({ user: borrowerId, book: bookId, status: 'issued' });
    if (existingIssue) {
      return res.status(400).json({ message: 'You have already borrowed this book.' });
    }

    const loanDays = parseInt(process.env.LOAN_PERIOD_DAYS) || 14;
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + loanDays);

    const issue = await Issue.create({
      user: borrowerId,
      book: bookId,
      dueDate,
      finePerDay: parseInt(process.env.FINE_PER_DAY) || 5,
    });

    // Decrease available copies & increment borrow count
    book.availableCopies -= 1;
    book.borrowCount += 1;
    await book.save();

    // If this user had a reservation for this book, mark it as completed
    await Reservation.findOneAndUpdate(
      { user: borrowerId, book: bookId, status: { $in: ['pending', 'ready'] } },
      { status: 'completed' }
    );

    // Create notification
    await Notification.create({
      user: borrowerId,
      title: 'Book Issued',
      message: `"${book.title}" has been issued to you. Due date: ${dueDate.toLocaleDateString()}.`,
      type: 'issue',
    });

    // Log activity
    await ActivityLog.create({
      user: req.user._id,
      action: 'Issued book',
      entity: 'Issue',
      entityId: issue._id,
      details: `Issued "${book.title}" to user ${borrowerId}`,
    });

    const populatedIssue = await Issue.findById(issue._id)
      .populate('user', 'name email')
      .populate('book', 'title author coverImage isbn');

    res.status(201).json(populatedIssue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Return a book
// @route   PUT /api/issues/:id/return
const returnBook = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id).populate('book').populate('user', 'name email');

    if (!issue) {
      return res.status(404).json({ message: 'Issue record not found' });
    }

    if (issue.status === 'returned') {
      return res.status(400).json({ message: 'This book has already been returned' });
    }

    const returnDate = new Date();
    const fineInfo = calculateFine(issue.dueDate, returnDate);

    issue.returnDate = returnDate;
    issue.status = 'returned';
    issue.fine = fineInfo.totalFine;

    await issue.save();

    // Increase available copies
    const book = await Book.findById(issue.book._id);
    book.availableCopies += 1;
    await book.save();

    // Notification for user
    let notifMessage = `"${book.title}" has been returned successfully.`;
    if (fineInfo.totalFine > 0) {
      notifMessage += ` Late by ${fineInfo.lateDays} day(s). Fine: ₹${fineInfo.totalFine}.`;
    }

    await Notification.create({
      user: issue.user._id,
      title: 'Book Returned',
      message: notifMessage,
      type: 'return',
    });

    // Check for pending reservations and notify first in queue
    const nextReservation = await Reservation.findOne({
      book: book._id,
      status: 'pending',
    }).sort('queuePosition');

    if (nextReservation) {
      const expiryHours = parseInt(process.env.RESERVATION_EXPIRY_HOURS) || 48;
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + expiryHours);

      nextReservation.status = 'ready';
      nextReservation.expiresAt = expiresAt;
      await nextReservation.save();

      await Notification.create({
        user: nextReservation.user,
        title: 'Reservation Ready',
        message: `"${book.title}" is now available for you! Pick it up within ${expiryHours} hours.`,
        type: 'reservation',
      });
    }

    // Log activity
    await ActivityLog.create({
      user: req.user._id,
      action: 'Processed return',
      entity: 'Issue',
      entityId: issue._id,
      details: `Returned "${book.title}". Fine: ₹${fineInfo.totalFine}`,
    });

    const updatedIssue = await Issue.findById(issue._id)
      .populate('user', 'name email')
      .populate('book', 'title author coverImage isbn');

    res.json(updatedIssue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all issues (admin)
// @route   GET /api/issues
const getAllIssues = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const query = {};
    if (status) query.status = status;

    const total = await Issue.countDocuments(query);
    const issues = await Issue.find(query)
      .populate('user', 'name email department')
      .populate('book', 'title author isbn coverImage')
      .sort('-createdAt')
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    res.json({
      issues,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get my issues (student)
// @route   GET /api/issues/my
const getMyIssues = async (req, res) => {
  try {
    const { status } = req.query;
    const query = { user: req.user._id };
    if (status) query.status = status;

    const issues = await Issue.find(query)
      .populate('book', 'title author isbn coverImage category')
      .sort('-createdAt');

    // Auto-mark overdue
    const now = new Date();
    for (let issue of issues) {
      if (issue.status === 'issued' && issue.dueDate < now) {
        issue.status = 'overdue';
        await issue.save();
      }
    }

    res.json(issues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single issue
// @route   GET /api/issues/:id
const getIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id)
      .populate('user', 'name email department year phone')
      .populate('book', 'title author isbn coverImage category');

    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    res.json(issue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Pay fine
// @route   PUT /api/issues/:id/pay-fine
const payFine = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    if (issue.fine === 0) {
      return res.status(400).json({ message: 'No fine to pay' });
    }

    issue.finePaid = true;
    await issue.save();

    await ActivityLog.create({
      user: req.user._id,
      action: 'Marked fine as paid',
      entity: 'Issue',
      entityId: issue._id,
      details: `Fine ₹${issue.fine} marked as paid`,
    });

    res.json({ message: 'Fine marked as paid', issue });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { issueBook, returnBook, getAllIssues, getMyIssues, getIssue, payFine };
