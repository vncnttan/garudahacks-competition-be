import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Garuda Hacks BE 6.0 API Documentation',
      version: '1.0.0',
      description: 'API documentation for Garuda Hacks Backend',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      schemas: {
        BaseResponseSuccess: {
          type: 'object',
          required: ['success', 'data'],
          properties: {
            success: {
              type: 'boolean',
              enum: [true],
              description: 'Indicates successful response'
            },
            message: {
              type: 'string',
              description: 'Success message'
            },
            data: {
              type: 'object',
              description: 'Response data'
            },
          }
        },
        BaseResponseError: {
          type: 'object',
          required: ['success', 'message'],
          properties: {
            success: {
              type: 'boolean',
              enum: [false],
              description: 'Indicates error response'
            },
            message: {
              type: 'string',
              description: 'Error message'
            },
            ...(process.env.NODE_ENV === "development" && { stack: {
                type: 'string',
                description: 'Error stack'
            }})
          }
        }
      },
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
  apis: ['./src/routes/*.ts', './src/dtos/*.ts'],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec; 