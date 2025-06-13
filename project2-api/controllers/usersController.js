// controllers/usersController.js
const { ObjectId } = require('mongodb');
const { getDb } = require('../db/connect');

// GET all users
const getAllUsers = async (req, res) => {
  try {
    const db = getDb();
    const users = await db.collection('users').find().toArray();

    const filteredUsers = users.map(user => ({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      isActive: user.isActive,
      profileImage: user.profileImage
    }));

    res.status(200).json(filteredUsers);
  } catch {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// GET single user
const getUserById = async (req, res) => {
  try {
    const db = getDb();
    const user = await db.collection('users').findOne({ _id: new ObjectId(req.params.id) });

    if (!user) return res.status(404).json({ error: 'User not found' });

    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      isActive: user.isActive,
      profileImage: user.profileImage
    });
  } catch {
    res.status(400).json({ error: 'Invalid ID format' });
  }
};

// POST create user
const createUser = async (req, res) => {
  try {
    const { username, email, password, role, createdAt, isActive, profileImage } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required' });
    }

    const db = getDb();
    const newUser = {
      username,
      email,
      password, // assume this is already hashed if needed
      role: role || 'user',
      createdAt: createdAt || new Date(),
      isActive: isActive !== undefined ? isActive : true,
      profileImage: profileImage || ''
    };

    const result = await db.collection('users').insertOne(newUser);

    res.status(201).json({
      _id: result.insertedId,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
      createdAt: newUser.createdAt,
      isActive: newUser.isActive,
      profileImage: newUser.profileImage
    });
  } catch {
    res.status(500).json({ error: 'Failed to create user' });
  }
};

// PUT update user
const updateUser = async (req, res) => {
  try {
    const { username, email, password, role, createdAt, isActive, profileImage } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required' });
    }

    const db = getDb();
    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(req.params.id) },
      {
        $set: {
          username,
          email,
          password,
          role: role || 'user',
          createdAt: createdAt || new Date(),
          isActive: isActive !== undefined ? isActive : true,
          profileImage: profileImage || ''
        }
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'User updated' });
  } catch {
    res.status(400).json({ error: 'Invalid ID format' });
  }
};

// DELETE user
const deleteUser = async (req, res) => {
  try {
    const db = getDb();
    const result = await db.collection('users').deleteOne({ _id: new ObjectId(req.params.id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted' });
  } catch {
    res.status(400).json({ error: 'Invalid ID format' });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};