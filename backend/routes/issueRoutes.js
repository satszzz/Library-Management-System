const express = require('express');
const router = express.Router();
const { issueBook, returnBook, getAllIssues, getMyIssues, getIssue, payFine } = require('../controllers/issueController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

router.post('/', protect, issueBook);
router.get('/', protect, adminOnly, getAllIssues);
router.get('/my', protect, getMyIssues);
router.get('/:id', protect, getIssue);
router.put('/:id/return', protect, adminOnly, returnBook);
router.put('/:id/pay-fine', protect, adminOnly, payFine);

module.exports = router;
