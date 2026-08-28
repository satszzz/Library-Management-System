const express = require('express');
const router = express.Router();
const { getDashboardStats, getBorrowingReport, getFineReport, getStudentDashboard } = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');
const ActivityLog = require('../models/ActivityLog');

router.get('/dashboard', protect, adminOnly, getDashboardStats);
router.get('/borrowings', protect, adminOnly, getBorrowingReport);
router.get('/fines', protect, adminOnly, getFineReport);
router.get('/student-dashboard', protect, getStudentDashboard);

// Activity logs
router.get('/activity-logs', protect, adminOnly, async (req, res) => {
  try {
    const { page = 1, limit = 30 } = req.query;
    const total = await ActivityLog.countDocuments();
    const logs = await ActivityLog.find()
      .populate('user', 'name email')
      .sort('-createdAt')
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    res.json({
      logs,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
