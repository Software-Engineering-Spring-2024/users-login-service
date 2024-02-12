//importing modules
const express = require('express');
const userController = require('../controller/userController');
const { signup, login } = userController;
const {checkUser} = require("../middleware/userVerificationExistsOrNot");

const router = express.Router()

//signup endpoint
//passing the middleware function to the signup
router.post('/signup',checkUser, signup)

//login route
router.post('/login', login )

module.exports = router