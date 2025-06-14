const express = require('express');
const { ObjectId } = require('mongodb');
const { getDb } = require('../db/connect');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: API for managing reviews (OAuth protected)
 */

/**
 * @swagger
 * /api/reviews:
 *   get:
 *     summary: Get all reviews (OAuth protected)
 *     tags: [Reviews]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of all reviews
 *       401:
 *         description: Unauthorized
 */
router.get('/', async (req, res) => {
  try {
    const db = getDb();
    const reviews = await db.collection('reviews').find().toArray();
    res.status(200).json(reviews);
  } catch {
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

/**
 * @swagger
 * /api/reviews/{id}:
 *   get:
 *     summary: Get a single review by ID (OAuth protected)
 *     tags: [Reviews]
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
 *         description: A single review
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Review not found
 */
router.get('/:id', async (req, res) => {
  try {
    const db = getDb();
    const review = await db.collection('reviews').findOne({ _id: new ObjectId(req.params.id) });
    if (!review) return res.status(404).json({ error: 'Review not found' });
    res.status(200).json(review);
  } catch {
    res.status(400).json({ error: 'Invalid ID format' });
  }
});

/**
 * @swagger
 * /api/reviews:
 *   post:
 *     summary: Create a new review (OAuth protected)
 *     tags: [Reviews]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [productId, userId, username, rating, comment, createdAt, verifiedPurchase]
 *             properties:
 *               productId:
 *                 type: string
 *               userId:
 *                 type: string
 *               username:
 *                 type: string
 *               rating:
 *                 type: number
 *               comment:
 *                 type: string
 *               createdAt:
 *                 type: string
 *                 format: date-time
 *               verifiedPurchase:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Review created
 *       400:
 *         description: Invalid input
 */
router.post('/', async (req, res) => {
  const { productId, userId, username, rating, comment, createdAt, verifiedPurchase } = req.body;

  if (!productId || !userId || !username || !rating || !comment || !createdAt || verifiedPurchase == null) {
    return res.status(400).json({ error: 'All 7 fields are required' });
  }

  try {
    const db = getDb();
    const result = await db.collection('reviews').insertOne({
      productId, userId, username, rating, comment, createdAt, verifiedPurchase
    });
    res.status(201).json(result);
  } catch {
    res.status(500).json({ error: 'Failed to create review' });
  }
});

/**
 * @swagger
 * /api/reviews/{id}:
 *   put:
 *     summary: Update an existing review (OAuth protected)
 *     tags: [Reviews]
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
 *             required: [productId, userId, username, rating, comment, createdAt, verifiedPurchase]
 *             properties:
 *               productId:
 *                 type: string
 *               userId:
 *                 type: string
 *               username:
 *                 type: string
 *               rating:
 *                 type: number
 *               comment:
 *                 type: string
 *               createdAt:
 *                 type: string
 *                 format: date-time
 *               verifiedPurchase:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Review updated
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Review not found
 */
router.put('/:id', async (req, res) => {
  const { productId, userId, username, rating, comment, createdAt, verifiedPurchase } = req.body;

  if (!productId || !userId || !username || !rating || !comment || !createdAt || verifiedPurchase == null) {
    return res.status(400).json({ error: 'All 7 fields are required for update' });
  }

  try {
    const db = getDb();
    const result = await db.collection('reviews').updateOne(
      { _id: new ObjectId(req.params.id) },
      {
        $set: {
          productId, userId, username, rating, comment, createdAt, verifiedPurchase
        }
      }
    );
    res.status(200).json(result);
  } catch {
    res.status(400).json({ error: 'Failed to update review' });
  }
});

/**
 * @swagger
 * /api/reviews/{id}:
 *   delete:
 *     summary: Delete a review (OAuth protected)
 *     tags: [Reviews]
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
 *         description: Review deleted
 *       404:
 *         description: Review not found
 */
router.delete('/:id', async (req, res) => {
  try {
    const db = getDb();
    const result = await db.collection('reviews').deleteOne({ _id: new ObjectId(req.params.id) });
    res.status(200).json(result);
  } catch {
    res.status(400).json({ error: 'Invalid delete request' });
  }
});

module.exports = router;