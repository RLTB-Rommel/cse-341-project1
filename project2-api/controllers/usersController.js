// controllers/usersController.js
const { ObjectId } = require('mongodb');
const { getDb } = require('../db/connect');

const getAllUsers = async (req, res) => {
  try {
    const db = getDb();
    const users = await db.collection('users').find().toArray();
    res.status(200).json(users);
  } catch {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

const getUserById = async (req, res) => {
  try {
    const db = getDb();
    const user = await db.collection('users').findOne({ _id: new ObjectId(req.params.id) });

    if (!user) return res.status(404).json({ error: 'User not found' });
    res.status(200).json(user);
  } catch {
    res.status(400).json({ error: 'Invalid ID format' });
  }
};

const createUser = async (req, res) => {
  try {
    const { username, email } = req.body;
    if (!username || !email) {
      return res.status(400).json({ error: 'Username and email are required' });
    }

    const db = getDb();
    const result = await db.collection('users').insertOne({ username, email });
    res.status(201).json(result);
  } catch {
    res.status(500).json({ error: 'Failed to create user' });
  }
};

const updateUser = async (req, res) => {
  try {
    const { username, email } = req.body;
    if (!username || !email) {
      return res.status(400).json({ error: 'Username and email are required' });
    }

    const db = getDb();
    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { username, email } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'User updated' });
  } catch {
    res.status(400).json({ error: 'Invalid ID format' });
  }
};

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