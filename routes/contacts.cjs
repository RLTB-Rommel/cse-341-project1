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
 *         description: List of contacts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
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

module.exports = router;