// db/connect.js
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
dotenv.config();

let db;

async function connectToDatabase() {
  const client = new MongoClient(process.env.MONGO_URI);
  await client.connect();
  db = client.db(); // Picks database from URI
  console.log('Connected to MongoDB');
}

function getDb() {
  if (!db) throw new Error('Database not connected');
  return db;
}

module.exports = { connectToDatabase, getDb };