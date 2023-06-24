import swaggerJsDoc from 'swagger-jsdoc';

const options = {
  definition: {
    failOnError: true,
    openapi: '3.0.0',
    info: {
      title: 'User microservice',
      version: '0.0.1',
      description: 'User microservice'
    },
    servers: [
      {
        url: 'http://localhost:5001'
      }
    ]
  },
  apis: ['./**/*.yaml']
};

export default swaggerJsDoc(options);
