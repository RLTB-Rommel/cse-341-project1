const express = require('express');
const { ObjectId } = require('mongodb');
const { getDb } = require('../db/connect');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: API for managing products (OAuth protected)
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products (OAuth protected)
 *     tags: [Products]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of all products
 *       401:
 *         description: Unauthorized
 */
router.get('/', async (req, res) => {
  try {
    const db = getDb();
    const products = await db.collection('products').find().toArray();
    res.status(200).json(products);
  } catch {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get a single product by ID (OAuth protected)
 *     tags: [Products]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A single product
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 */
router.get('/:id', async (req, res) => {
  try {
    const db = getDb();
    const product = await db.collection('products').findOne({ _id: new ObjectId(req.params.id) });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.status(200).json(product);
  } catch {
    res.status(400).json({ error: 'Invalid ID format' });
  }
});

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product (OAuth protected)
 *     tags: [Products]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, price, category, description, brand, stock, imageUrl]
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *               brand:
 *                 type: string
 *               stock:
 *                 type: number
 *               imageUrl:
 *                 type: string
 *     responses:
 *       201:
 *         description: Product created
 *       400:
 *         description: Invalid input
 */
router.post('/', async (req, res) => {
  const { name, price, category, description, brand, stock, imageUrl } = req.body;

  if (!name || !price || !category || !description || !brand || stock == null || !imageUrl) {
    return res.status(400).json({ error: 'All 7 fields are required' });
  }

  try {
    const db = getDb();
    const result = await db.collection('products').insertOne({
      name, price, category, description, brand, stock, imageUrl
    });
    res.status(201).json(result);
  } catch {
    res.status(500).json({ error: 'Failed to create product' });
  }
});

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update an existing product (OAuth protected)
 *     tags: [Products]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, price, category, description, brand, stock, imageUrl]
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *               brand:
 *                 type: string
 *               stock:
 *                 type: number
 *               imageUrl:
 *                 type: string
 *     responses:
 *       200:
 *         description: Product updated
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Product not found
 */
router.put('/:id', async (req, res) => {
  const { name, price, category, description, brand, stock, imageUrl } = req.body;

  if (!name || !price || !category || !description || !brand || stock == null || !imageUrl) {
    return res.status(400).json({ error: 'All 7 fields are required for update' });
  }

  try {
    const db = getDb();
    const result = await db.collection('products').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { name, price, category, description, brand, stock, imageUrl } }
    );
    res.status(200).json(result);
  } catch {
    res.status(400).json({ error: 'Failed to update product' });
  }
});

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a product (OAuth protected)
 *     tags: [Products]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted
 *       404:
 *         description: Product not found
 */
router.delete('/:id', async (req, res) => {
  try {
    const db = getDb();
    const result = await db.collection('products').deleteOne({ _id: new ObjectId(req.params.id) });
    res.status(200).json(result);
  } catch {
    res.status(400).json({ error: 'Invalid delete request' });
  }
});

module.exports = router;