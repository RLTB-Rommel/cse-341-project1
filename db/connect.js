const { MongoClient } = require('mongodb');
require('dotenv').config();

let db;

async function connectToDatabase() {
    const client = new MongoClient(process.env.MONGO_URI, {
      serverApi: { version: '1', strict: true, deprecationErrors: true },
      tls: false
    });

  await client.connect();
  db = client.db('cse341');
  console.log('Connected to MongoDB');
}

function getDb() {
  if (!db) throw new Error('Database not connected!');
  return db;
}

module.exports = { connectToDatabase, getDb };