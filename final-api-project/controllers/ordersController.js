const { ObjectId } = require('mongodb');
const { getDb } = require('../db/connect');

// GET all orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await getDb().collection('orders').find().toArray();
    res.status(200).json(orders);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

// GET one order by ID
const getOrderById = async (req, res) => {
  try {
    const order = await getDb()
      .collection('orders')
      .findOne({ _id: new ObjectId(req.params.id) });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.status(200).json(order);
  } catch (err) {
    console.error('Error fetching order by ID:', err);
    res.status(400).json({ error: 'Invalid ID format' });
  }
};

// POST create order
const createOrder = async (req, res) => {
  try {
    const { productName, quantity, price, customerId, status, orderedAt, notes } = req.body;

    if (
      !productName ||
      typeof quantity !== 'number' ||
      typeof price !== 'number' ||
      typeof customerId !== 'string'
    ) {
      return res.status(400).json({ error: 'Missing required fields or invalid types' });
    }

    const parsedDate = orderedAt ? new Date(orderedAt) : new Date();
    if (orderedAt && isNaN(parsedDate.getTime())) {
      return res.status(400).json({ error: 'Invalid date format for orderedAt' });
    }

    const db = getDb();
    const newOrder = {
      productName,
      quantity,
      price,
      customerId, // Optionally: new ObjectId(customerId)
      status: status || 'pending',
      orderedAt: parsedDate,
      notes: notes || ''
    };

    const result = await db.collection('orders').insertOne(newOrder);
    res.status(201).json({ _id: result.insertedId, ...newOrder });
  } catch (err) {
    console.error('Error creating order:', err);
    res.status(500).json({ error: 'Failed to create order' });
  }
};

// PUT update order
const updateOrder = async (req, res) => {
  try {
    const { productName, quantity, price, customerId, status, orderedAt, notes } = req.body;

    if (
      !productName ||
      typeof quantity !== 'number' ||
      typeof price !== 'number' ||
      typeof customerId !== 'string'
    ) {
      return res.status(400).json({ error: 'Missing required fields or invalid types' });
    }

    const parsedDate = orderedAt ? new Date(orderedAt) : new Date();
    if (orderedAt && isNaN(parsedDate.getTime())) {
      return res.status(400).json({ error: 'Invalid date format for orderedAt' });
    }

    const result = await getDb().collection('orders').updateOne(
      { _id: new ObjectId(req.params.id) },
      {
        $set: {
          productName,
          quantity,
          price,
          customerId, // Optionally: new ObjectId(customerId)
          status: status || 'pending',
          orderedAt: parsedDate,
          notes: notes || ''
        }
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.status(200).json({ message: 'Order updated' });
  } catch (err) {
    console.error('Error updating order:', err);
    res.status(400).json({ error: 'Invalid ID format or request' });
  }
};

// DELETE order
const deleteOrder = async (req, res) => {
  try {
    const result = await getDb()
      .collection('orders')
      .deleteOne({ _id: new ObjectId(req.params.id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.status(200).json({ message: 'Order deleted' });
  } catch (err) {
    console.error('Error deleting order:', err);
    res.status(400).json({ error: 'Invalid ID format' });
  }
};

module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder
};