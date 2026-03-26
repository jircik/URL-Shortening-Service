import swaggerJsdoc from 'swagger-jsdoc';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'URL Shortener Service API',
            version: '1.0.0',
            description: 'API for creating and managing short URLs',
        },
        servers: [
            {
                url: process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`,
                description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server',
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
            schemas: {
                ShortUrl: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string', example: '664f1a2b3c4d5e6f7a8b9c0d' },
                        longUrl: { type: 'string', example: 'https://www.example.com/some/very/long/path' },
                        shortCode: { type: 'string', example: 'a1b2c3d4e5' },
                        accessCount: { type: 'integer', example: 42 },
                        isActive: { type: 'boolean', example: true },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                },
                ErrorMessage: {
                    type: 'object',
                    properties: {
                        message: { type: 'string' },
                    },
                },
            },
        },
    },
    apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;