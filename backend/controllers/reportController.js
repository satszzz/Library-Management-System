const Book = require('../models/Book');
const Issue = require('../models/Issue');
const User = require('../models/User');
const Reservation = require('../models/Reservation');
const Category = require('../models/Category');

// @desc    Get dashboard stats
// @route   GET /api/reports/dashboard
const getDashboardStats = async (req, res) => {
  try {
    const totalBooks = await Book.countDocuments();
    const totalCopies = await Book.aggregate([{ $group: { _id: null, total: { $sum: '$totalCopies' } } }]);
    const availableCopies = await Book.aggregate([{ $group: { _id: null, total: { $sum: '$availableCopies' } } }]);
    const totalStudents = await User.countDocuments({ role: 'student' });
    const issuedBooks = await Issue.countDocuments({ status: 'issued' });
    const overdueBooks = await Issue.countDocuments({ status: 'overdue' });
    const pendingReservations = await Reservation.countDocuments({ status: 'pending' });
    const totalFines = await Issue.aggregate([
      { $match: { fine: { $gt: 0 } } },
      { $group: { _id: null, total: { $sum: '$fine' }, unpaid: { $sum: { $cond: [{ $eq: ['$finePaid', false] }, '$fine', 0] } } } },
    ]);

    // Auto-mark overdue
    const now = new Date();
    await Issue.updateMany(
      { status: 'issued', dueDate: { $lt: now } },
      { status: 'overdue' }
    );

    res.json({
      totalBooks,
      totalCopies: totalCopies[0]?.total || 0,
      availableCopies: availableCopies[0]?.total || 0,
      totalStudents,
      issuedBooks,
      overdueBooks,
      pendingReservations,
      totalFines: totalFines[0]?.total || 0,
      unpaidFines: totalFines[0]?.unpaid || 0,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get borrowing report / issues per month
// @route   GET /api/reports/borrowings
const getBorrowingReport = async (req, res) => {
  try {
    // Issues per month (last 12 months)
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const issuesPerMonth = await Issue.aggregate([
      { $match: { issueDate: { $gte: twelveMonthsAgo } } },
      {
        $group: {
          _id: { month: { $month: '$issueDate' }, year: { $year: '$issueDate' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    // Books by category
    const booksByCategory = await Book.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 }, totalCopies: { $sum: '$totalCopies' } } },
      {
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: '_id',
          as: 'categoryInfo',
        },
      },
      { $unwind: { path: '$categoryInfo', preserveNullAndEmptyArrays: true } },
      { $project: { name: '$categoryInfo.name', count: 1, totalCopies: 1 } },
    ]);

    // Most borrowed books
    const mostBorrowed = await Book.find()
      .sort('-borrowCount')
      .limit(10)
      .select('title author borrowCount coverImage');

    // Issues vs Returns per month
    const returnsPerMonth = await Issue.aggregate([
      { $match: { returnDate: { $exists: true, $ne: null }, returnDate: { $gte: twelveMonthsAgo } } },
      {
        $group: {
          _id: { month: { $month: '$returnDate' }, year: { $year: '$returnDate' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    res.json({
      issuesPerMonth,
      returnsPerMonth,
      booksByCategory,
      mostBorrowed,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get fine report
// @route   GET /api/reports/fines
const getFineReport = async (req, res) => {
  try {
    const fines = await Issue.find({ fine: { $gt: 0 } })
      .populate('user', 'name email department')
      .populate('book', 'title author')
      .sort('-fine')
      .limit(100);

    const fineStats = await Issue.aggregate([
      { $match: { fine: { $gt: 0 } } },
      {
        $group: {
          _id: null,
          totalFines: { $sum: '$fine' },
          paidFines: { $sum: { $cond: ['$finePaid', '$fine', 0] } },
          unpaidFines: { $sum: { $cond: ['$finePaid', 0, '$fine'] } },
          count: { $sum: 1 },
        },
      },
    ]);

    res.json({
      fines,
      stats: fineStats[0] || { totalFines: 0, paidFines: 0, unpaidFines: 0, count: 0 },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get student dashboard stats
// @route   GET /api/reports/student-dashboard
const getStudentDashboard = async (req, res) => {
  try {
    const userId = req.user._id;
    const now = new Date();

    // Auto-mark overdue
    await Issue.updateMany(
      { user: userId, status: 'issued', dueDate: { $lt: now } },
      { status: 'overdue' }
    );

    const currentlyBorrowed = await Issue.countDocuments({ user: userId, status: { $in: ['issued', 'overdue'] } });
    const totalReturned = await Issue.countDocuments({ user: userId, status: 'returned' });
    const activeReservations = await Reservation.countDocuments({ user: userId, status: { $in: ['pending', 'ready'] } });
    const totalFines = await Issue.aggregate([
      { $match: { user: userId, fine: { $gt: 0 }, finePaid: false } },
      { $group: { _id: null, total: { $sum: '$fine' } } },
    ]);
    const overdueBooks = await Issue.countDocuments({ user: userId, status: 'overdue' });

    // Current borrows with due dates
    const currentBorrows = await Issue.find({ user: userId, status: { $in: ['issued', 'overdue'] } })
      .populate('book', 'title author coverImage')
      .sort('dueDate');

    // Recent activity
    const recentActivity = await Issue.find({ user: userId })
      .populate('book', 'title author coverImage')
      .sort('-createdAt')
      .limit(5);

    res.json({
      currentlyBorrowed,
      totalReturned,
      activeReservations,
      pendingFines: totalFines[0]?.total || 0,
      overdueBooks,
      currentBorrows,
      recentActivity,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDashboardStats, getBorrowingReport, getFineReport, getStudentDashboard };
