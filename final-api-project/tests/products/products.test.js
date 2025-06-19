// tests/products/products.test.js
jest.setTimeout(15000); // extend timeout

process.env.NODE_ENV = 'test';

const request = require('supertest');
const { ObjectId } = require('mongodb');
const app = require('../../app');
const { connectToDatabase, closeDatabase } = require('../../db/connect');

let db;
let insertedId;

const testProduct = {
  name: 'Test Product',
  price: 99,
  category: 'Test Category',
  timestamp: new Date().toISOString()
};

beforeAll(async () => {
  db = await connectToDatabase();
  const result = await db.collection('products').insertOne(testProduct);
  insertedId = result.insertedId.toString();
});

afterAll(async () => {
  await db.collection('products').deleteOne({ _id: new ObjectId(insertedId) });
  await closeDatabase();
});

describe('GET /api/products', () => {
  it('should return a list of products', async () => {
    const res = await request(app).get('/api/products');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe('GET /api/products/:id', () => {
  it('should return a single product if ID exists', async () => {
    const res = await request(app).get(`/api/products/${insertedId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('_id', insertedId);
    expect(res.body).toHaveProperty('name', testProduct.name);
  });
});