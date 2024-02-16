//importing modules
const express = require('express');
const userController = require('../controller/userController');
const { signup, login, handleGoogleOAuth } = userController;
const {checkUser} = require("../middleware/userVerificationExistsOrNot");

const router = express.Router()

//signup endpoint
//passing the middleware function to the signup
router.post('/signup',checkUser, signup)

// user login/signup with google
router.post('/google-auth', handleGoogleOAuth)

//login route
router.post('/login', login )

module.exports = router