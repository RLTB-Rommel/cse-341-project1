// controllers/itemsController.js
const { ObjectId } = require('mongodb');
const { getDb } = require('../db/connect');

// GET /api/items
const getAllItems = async (req, res) => {
  try {
    const db = getDb();
    const items = await db.collection('items').find().toArray();
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch items' });
  }
};

// GET /api/items/:id
const getItemById = async (req, res) => {
  try {
    const db = getDb();
    const item = await db.collection('items').findOne({ _id: new ObjectId(req.params.id) });

    if (!item) return res.status(404).json({ error: 'Item not found' });

    res.status(200).json(item);
  } catch (err) {
    res.status(400).json({ error: 'Invalid ID format' });
  }
};

// POST /api/items
const createItem = async (req, res) => {
  try {
    const { name, quantity } = req.body;

    if (!name || typeof quantity !== 'number') {
      return res.status(400).json({ error: 'Invalid input data' });
    }

    const db = getDb();
    const result = await db.collection('items').insertOne({ name, quantity });
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create item' });
  }
};

// PUT /api/items/:id
const updateItem = async (req, res) => {
  try {
    const { name, quantity } = req.body;

    if (!name || typeof quantity !== 'number') {
      return res.status(400).json({ error: 'Invalid input data' });
    }

    const db = getDb();
    const result = await db.collection('items').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { name, quantity } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.status(200).json({ message: 'Item updated' });
  } catch (err) {
    res.status(400).json({ error: 'Invalid ID format' });
  }
};

// DELETE /api/items/:id
const deleteItem = async (req, res) => {
  try {
    const db = getDb();
    const result = await db.collection('items').deleteOne({ _id: new ObjectId(req.params.id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.status(200).json({ message: 'Item deleted' });
  } catch (err) {
    res.status(400).json({ error: 'Invalid ID format' });
  }
};

module.exports = {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
};