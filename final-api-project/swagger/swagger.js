const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Final API Project',
      version: '1.0.0',
      description: 'CRUD API with MongoDB and OAuth (Google) authentication using sessions',
    },
    servers: [
      {
        url: 'https://cse-341-final-api-project.onrender.com', //
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'connect.sid',
        },
      },
    },
    security: [
      {
        cookieAuth: [],
      },
    ],
  },
  apis: ['./routes/orders.js', './routes/users.js', './routes/products.js', './routes/reviews.js'],
};

console.log('Loading Swagger from files:', options.apis);

const swaggerSpec = swaggerJsdoc(options);
module.exports = swaggerSpec;
