const User = require('../models/User');
const Issue = require('../models/Issue');
const ActivityLog = require('../models/ActivityLog');

// @desc    Get all users (admin)
// @route   GET /api/users
const getUsers = async (req, res) => {
  try {
    const { search, role, page = 1, limit = 20 } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { department: { $regex: search, $options: 'i' } },
      ];
    }

    if (role) query.role = role;

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select('-password')
      .sort('-createdAt')
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    res.json({
      users,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single user (admin)
// @route   GET /api/users/:id
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get borrowing stats
    const totalIssued = await Issue.countDocuments({ user: user._id });
    const currentlyBorrowed = await Issue.countDocuments({ user: user._id, status: { $in: ['issued', 'overdue'] } });
    const totalFines = await Issue.aggregate([
      { $match: { user: user._id, fine: { $gt: 0 } } },
      { $group: { _id: null, total: { $sum: '$fine' } } },
    ]);

    res.json({
      ...user.toObject(),
      stats: {
        totalIssued,
        currentlyBorrowed,
        totalFines: totalFines[0]?.total || 0,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user (admin)
// @route   PUT /api/users/:id
const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { name, phone, department, year, isActive, role } = req.body;

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (department !== undefined) user.department = department;
    if (year !== undefined) user.year = year;
    if (isActive !== undefined) user.isActive = isActive;
    if (role && req.user.role === 'admin') user.role = role;

    const updated = await user.save();

    await ActivityLog.create({
      user: req.user._id,
      action: isActive === false ? 'Deactivated user' : 'Updated user',
      entity: 'User',
      entityId: updated._id,
      details: `Updated user "${updated.name}"`,
    });

    res.json({
      _id: updated._id,
      name: updated.name,
      email: updated.email,
      role: updated.role,
      phone: updated.phone,
      department: updated.department,
      year: updated.year,
      isActive: updated.isActive,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete user (admin)
// @route   DELETE /api/users/:id
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check active issues
    const activeIssues = await Issue.countDocuments({ user: user._id, status: 'issued' });
    if (activeIssues > 0) {
      return res.status(400).json({ message: 'Cannot delete user with active book issues.' });
    }

    const name = user.name;
    await User.findByIdAndDelete(req.params.id);

    await ActivityLog.create({
      user: req.user._id,
      action: 'Deleted user',
      entity: 'User',
      entityId: req.params.id,
      details: `Deleted user "${name}"`,
    });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getUsers, getUser, updateUser, deleteUser };
