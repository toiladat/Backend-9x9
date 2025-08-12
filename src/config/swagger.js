import swaggerJSDoc from 'swagger-jsdoc'

export const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: '9x9 API',
      version: '1.0.0',
      description: 'Tài liệu API 9x9 Plus'
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Local server'
      },
      {
        url: 'https://backend-9x9.onrender.com/api',
        description: 'Production server (Render)'
      },
      {
        url:'https://backend-9x9-v2.onrender.com/api',
        description: 'Production server_V2 (Render)'
      },
      {
        url:'https://api.9x9plus.com/api',
        description: 'Production'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./src/routes/*.js']
}

export const getSwaggerSpec = () => swaggerJSDoc(swaggerOptions)
