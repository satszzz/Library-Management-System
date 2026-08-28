const Book = require('../models/Book');
const Issue = require('../models/Issue');
const ActivityLog = require('../models/ActivityLog');
const QRCode = require('qrcode');

// @desc    Get all books with search, filter, pagination
// @route   GET /api/books
const getBooks = async (req, res) => {
  try {
    const { search, category, author, available, year, page = 1, limit = 12, sort = '-createdAt' } = req.query;

    const query = {};

    // Text search
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
        { isbn: { $regex: search, $options: 'i' } },
      ];
    }

    // Filters
    if (category) query.category = category;
    if (author) query.author = { $regex: author, $options: 'i' };
    if (available === 'true') query.availableCopies = { $gt: 0 };
    if (available === 'false') query.availableCopies = 0;
    if (year) query.publicationYear = parseInt(year);

    const total = await Book.countDocuments(query);
    const books = await Book.find(query)
      .populate('category', 'name')
      .sort(sort)
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    res.json({
      books,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single book
// @route   GET /api/books/:id
const getBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate('category', 'name');

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create book (admin)
// @route   POST /api/books
const createBook = async (req, res) => {
  try {
    const { title, author, isbn, category, publisher, publicationYear, description, coverImage, totalCopies } = req.body;

    if (!title || !author || !isbn || !category || !totalCopies) {
      return res.status(400).json({ message: 'Title, author, ISBN, category, and total copies are required' });
    }

    const existingBook = await Book.findOne({ isbn });
    if (existingBook) {
      return res.status(400).json({ message: 'A book with this ISBN already exists' });
    }

    const book = await Book.create({
      title,
      author,
      isbn,
      category,
      publisher,
      publicationYear,
      description,
      coverImage,
      totalCopies,
      availableCopies: totalCopies,
    });

    // Log activity
    await ActivityLog.create({
      user: req.user._id,
      action: 'Created a new book',
      entity: 'Book',
      entityId: book._id,
      details: `Added "${title}" by ${author}`,
    });

    const populatedBook = await Book.findById(book._id).populate('category', 'name');
    res.status(201).json(populatedBook);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update book (admin)
// @route   PUT /api/books/:id
const updateBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const { title, author, isbn, category, publisher, publicationYear, description, coverImage, totalCopies } = req.body;

    // If totalCopies changed, adjust availableCopies proportionally
    if (totalCopies !== undefined && totalCopies !== book.totalCopies) {
      const issuedCopies = book.totalCopies - book.availableCopies;
      const newAvailable = Math.max(0, totalCopies - issuedCopies);
      book.availableCopies = newAvailable;
      book.totalCopies = totalCopies;
    }

    if (title) book.title = title;
    if (author) book.author = author;
    if (isbn) book.isbn = isbn;
    if (category) book.category = category;
    if (publisher !== undefined) book.publisher = publisher;
    if (publicationYear !== undefined) book.publicationYear = publicationYear;
    if (description !== undefined) book.description = description;
    if (coverImage !== undefined) book.coverImage = coverImage;

    const updatedBook = await book.save();

    // Log activity
    await ActivityLog.create({
      user: req.user._id,
      action: 'Updated book',
      entity: 'Book',
      entityId: updatedBook._id,
      details: `Updated "${updatedBook.title}"`,
    });

    const populatedBook = await Book.findById(updatedBook._id).populate('category', 'name');
    res.json(populatedBook);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete book (admin)
// @route   DELETE /api/books/:id
const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Check if book has active issues
    const activeIssues = await Issue.countDocuments({ book: book._id, status: 'issued' });
    if (activeIssues > 0) {
      return res.status(400).json({ message: 'Cannot delete book with active issues. Process returns first.' });
    }

    const title = book.title;
    await Book.findByIdAndDelete(req.params.id);

    // Log activity
    await ActivityLog.create({
      user: req.user._id,
      action: 'Deleted book',
      entity: 'Book',
      entityId: req.params.id,
      details: `Deleted "${title}"`,
    });

    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get QR code for a book
// @route   GET /api/books/:id/qrcode
const getBookQRCode = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const bookUrl = `${clientUrl}/books/${book._id}`;
    
    const qrCodeDataUrl = await QRCode.toDataURL(bookUrl, {
      width: 300,
      margin: 2,
      color: { dark: '#1a1a2e', light: '#ffffff' },
    });

    res.json({ qrCode: qrCodeDataUrl, bookUrl });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getBooks, getBook, createBook, updateBook, deleteBook, getBookQRCode };
