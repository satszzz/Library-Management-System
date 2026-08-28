const express = require('express');
const router = express.Router();
const { getBooks, getBook, createBook, updateBook, deleteBook, getBookQRCode } = require('../controllers/bookController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

router.get('/', getBooks);
router.get('/:id', getBook);
router.post('/', protect, adminOnly, createBook);
router.put('/:id', protect, adminOnly, updateBook);
router.delete('/:id', protect, adminOnly, deleteBook);
router.get('/:id/qrcode', protect, getBookQRCode);

module.exports = router;
