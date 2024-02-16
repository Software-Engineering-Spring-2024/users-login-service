//importing modules
const express = require('express');
const userController = require('../controller/userController');
const { handleGoogleOAuth } = userController;
const signup = require("../services/signup");
// const { signup, login } = userController;
const sendOtp = require("../services/sendOtp");
const {checkUser, verifyEmail} = require("../middleware/userVerificationExistsOrNot");
const login = require("../services/login");

const router = express.Router();

//signup endpoint
//passing the middleware function to the signup
router.post('/signup',checkUser, signup);

// user login/signup with google
router.post('/google-auth', handleGoogleOAuth)

//login route
router.post('/login', login );

//Send Otp to email
router.post('/sendOtp',sendOtp);
// //Verify Email exists or not
// router.post('/verify-email',checkUser);

module.exports = router;