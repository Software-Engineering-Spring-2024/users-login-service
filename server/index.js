const express = require('express');
// const sequelize = require('sequelize');
const dotenv = require('dotenv').config();
const cookieParser = require('cookie-parser');
const db = require('./model');
const userRoutes = require ('./routes/userRoutes');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const swaggerConfig = require('./swagger-config')
const {options} = swaggerConfig;
const cors = require('cors');



//Application
const app = express();
//setting up your port
const PORT = process.env.PORT || 8080;

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());


//Swagger Setup
const openapiSpecification =  swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification,{ explorer: true }));


//routes for the user API
app.use('/api/users',userRoutes);

//Listening
app.listen(PORT, () => console.log(`Server is connected on ${PORT}`));
