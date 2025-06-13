const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Project 2 API',
      version: '1.0.0',
      description: 'CRUD API with MongoDB and JWT authentication',
    },
    servers: [
      {
        url: 'http://localhost:3000', // or your Render URL after deploy
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./routes/*.js'], // Path to route files for Swagger comments
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;