const express = require('express');
const { ObjectId } = require('mongodb');
const { getDb } = require('../db/connect');

const router = express.Router();

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

module.exports = router;