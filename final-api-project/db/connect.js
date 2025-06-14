const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
dotenv.config();

let db;

async function connectToDatabase() {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error('MONGO_URI not found in environment variables.');
    throw new Error('Missing MongoDB URI');
  }

  try {
    const client = new MongoClient(uri);
    await client.connect();
    db = client.db(); // Defaults to DB name from URI
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err.message);
    throw err;
  }
}

function getDb() {
  if (!db) throw new Error('Database not connected. Call connectToDatabase() first.');
  return db;
}

module.exports = { connectToDatabase, getDb };