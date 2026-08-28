const Category = require('../models/Category');
const Book = require('../models/Book');
const ActivityLog = require('../models/ActivityLog');

// @desc    Get all categories
// @route   GET /api/categories
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort('name');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create category (admin)
// @route   POST /api/categories
const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    const existing = await Category.findOne({ name: { $regex: `^${name}$`, $options: 'i' } });
    if (existing) {
      return res.status(400).json({ message: 'Category already exists' });
    }

    const category = await Category.create({ name, description });

    await ActivityLog.create({
      user: req.user._id,
      action: 'Created category',
      entity: 'Category',
      entityId: category._id,
      details: `Created category "${name}"`,
    });

    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update category (admin)
// @route   PUT /api/categories/:id
const updateCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    category.name = req.body.name || category.name;
    category.description = req.body.description !== undefined ? req.body.description : category.description;

    const updated = await category.save();

    await ActivityLog.create({
      user: req.user._id,
      action: 'Updated category',
      entity: 'Category',
      entityId: updated._id,
      details: `Updated category to "${updated.name}"`,
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete category (admin)
// @route   DELETE /api/categories/:id
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const bookCount = await Book.countDocuments({ category: category._id });
    if (bookCount > 0) {
      return res.status(400).json({
        message: `Cannot delete category. ${bookCount} book(s) are using this category. Reassign them first.`,
      });
    }

    const name = category.name;
    await Category.findByIdAndDelete(req.params.id);

    await ActivityLog.create({
      user: req.user._id,
      action: 'Deleted category',
      entity: 'Category',
      entityId: req.params.id,
      details: `Deleted category "${name}"`,
    });

    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };
