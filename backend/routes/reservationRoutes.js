const express = require('express');
const router = express.Router();
const { reserveBook, getMyReservations, getAllReservations, cancelReservation } = require('../controllers/reservationController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

router.post('/', protect, reserveBook);
router.get('/my', protect, getMyReservations);
router.get('/', protect, adminOnly, getAllReservations);
router.put('/:id/cancel', protect, cancelReservation);

module.exports = router;
