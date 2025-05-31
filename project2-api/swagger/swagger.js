// swagger/swagger.js
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Project 2 API',
      version: '1.0.0',
      description: 'CRUD API with MongoDB',
    },
    servers: [
      {
        url: 'http://localhost:3000', // Change to your Render link after deployment
      },
    ],
  },
  apis: ['./routes/*.js'], // Path to the route files for auto-generated docs
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;