require('dotenv').config();
const { MongoClient } = require('mongodb');
require('dotenv').config();

let db;

async function connectToDatabase() {
  const client = new MongoClient(process.env.MONGO_URI);
  await client.connect();
  db = client.db('cse341'); // You can name the DB anything
  console.log('Connected to MongoDB');
}

function getDb() {
  if (!db) {
    throw new Error('Database not connected!');
  }
  return db;
}

module.exports = { connectToDatabase, getDb };
console.log('MONGO_URI:', process.env.MONGO_URI);