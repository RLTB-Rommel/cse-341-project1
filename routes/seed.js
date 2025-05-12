const express = require('express');
const router = express.Router();
const { getDb } = require('../db/connect');

router.get('/seed', async (req, res) => {
  try {
    const db = getDb();
    const contacts = db.collection('contacts');

    const result = await contacts.insertMany([
      {
        firstName: 'Alice',
        lastName: 'Smith',
        email: 'alice@example.com',
        favoriteColor: 'Blue',
        birthday: '1991-06-10'
      },
      {
        firstName: 'Bob',
        lastName: 'Johnson',
        email: 'bob@example.com',
        favoriteColor: 'Green',
        birthday: '1989-09-23'
      },
      {
        firstName: 'Charlie',
        lastName: 'Davis',
        email: 'charlie@example.com',
        favoriteColor: 'Red',
        birthday: '1995-12-01'
      }
    ]);

    res.send(`Inserted ${result.insertedCount} contacts.`);
  } catch (err) {
    res.status(500).send('Error seeding contacts: ' + err.message);
  }
});

module.exports = router;