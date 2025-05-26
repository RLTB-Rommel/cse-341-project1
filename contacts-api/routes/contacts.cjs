const express = require('express');
const { ObjectId } = require('mongodb');
const { getDb } = require('../db/connect');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Contacts
 *   description: Contact management API
 */

/**
 * @swagger
 * /contacts:
 *   get:
 *     summary: Get all contacts
 *     tags: [Contacts]
 *     responses:
 *       200:
 *         description: List of all contacts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "683287dce167691cc75189a5"
 *                   firstName:
 *                     type: string
 *                     example: "Carlo"
 *                   lastName:
 *                     type: string
 *                     example: "Doe"
 *                   email:
 *                     type: string
 *                     example: "carloodoe@example.com"
 *                   favoriteColor:
 *                     type: string
 *                     example: "blue"
 *                   birthday:
 *                     type: string
 *                     format: date
 *                     example: "1995-04-24"
 *       500:
 *         description: Server error
 */
router.get('/', async (req, res) => {
  try {
    const db = getDb();
    const contacts = await db.collection('contacts').find().toArray();
    res.status(200).json(contacts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
});

/**
 * @swagger
 * /contacts/{id}:
 *   get:
 *     summary: Get a contact by ID
 *     tags: [Contacts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The MongoDB ObjectId of the contact
 *     responses:
 *       200:
 *         description: Contact data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "683287dce167691cc75189a5"
 *                 firstName:
 *                   type: string
 *                   example: "Carlo"
 *                 lastName:
 *                   type: string
 *                   example: "Doe"
 *                 email:
 *                   type: string
 *                   example: "carloodoe@example.com"
 *                 favoriteColor:
 *                   type: string
 *                   example: "blue"
 *                 birthday:
 *                   type: string
 *                   format: date
 *                   example: "1995-04-24"
 *       404:
 *         description: Contact not found
 *       400:
 *         description: Invalid ID format
 */
router.get('/:id', async (req, res) => {
  try {
    const db = getDb();
    const id = new ObjectId(req.params.id);
    const contact = await db.collection('contacts').findOne({ _id: id });

    if (!contact) return res.status(404).json({ error: 'Contact not found.' });

    res.status(200).json(contact);
  } catch (err) {
    res.status(400).json({ error: 'Invalid ID format.' });
  }
});

/**
 * @swagger
 * /contacts:
 *   post:
 *     summary: Add a new contact
 *     tags:
 *       - Contacts
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: "Juan"
 *               lastName:
 *                 type: string
 *                 example: "Dela Cruz"
 *               email:
 *                 type: string
 *                 example: "juan@example.com"
 *               favoriteColor:
 *                 type: string
 *                 example: "green"
 *               birthday:
 *                 type: string
 *                 format: date
 *                 example: "1995-05-05"
 *     responses:
 *       201:
 *         description: Contact created
 */
router.post('/', async (req, res) => {
  try {
    const db = getDb();
    const contact = req.body;
    const result = await db.collection('contacts').insertOne(contact);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create contact' });
  }
});

/**
 * @swagger
 * /contacts/{id}:
 *   put:
 *     summary: Update a contact by ID
 *     tags: [Contacts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Contact ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               favoriteColor:
 *                 type: string
 *               birthday:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Contact updated successfully
 *       400:
 *         description: Invalid ID format
 *       404:
 *         description: Contact not found
 */
router.put('/:id', async (req, res) => {
  try {
    const db = getDb();
    const id = new ObjectId(req.params.id);
    const updateData = req.body;

    const result = await db.collection('contacts').replaceOne({ _id: id }, updateData);

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: 'Invalid ID format' });
  }
});

/**
 * @swagger
 * /contacts/{id}:
 *   delete:
 *     summary: Delete a contact by ID
 *     tags: [Contacts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Contact ID
 *     responses:
 *       200:
 *         description: Contact deleted successfully
 *       400:
 *         description: Invalid ID format
 *       404:
 *         description: Contact not found
 */
router.delete('/:id', async (req, res) => {
  try {
    const db = getDb();
    const id = new ObjectId(req.params.id);

    const result = await db.collection('contacts').deleteOne({ _id: id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    res.status(200).json({ message: 'Contact deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: 'Invalid ID format' });
  }
});

module.exports = router;