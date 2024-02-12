const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Express API with Swagger',
            version: '1.0.0',
            description: 'A simple Express API',
        },
        servers: [
            {
                url: "http://localhost:8080",
            },
        ],
    },
    apis: ['./routes/*.js', './index.js'], // paths to files with annotations
};



module.exports = {options}