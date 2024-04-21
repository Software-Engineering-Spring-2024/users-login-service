//importing modules
const express = require('express');
const userController = require('../controller/userController');
const { handleGoogleOAuth, handleResetPassword } = userController;
const signup = require("../services/signup");
// const { signup, login } = userController;
const sendOtp = require("../services/sendOtp");
const {resetPassword} = require("../services/resetPassword");
const {checkUser, verifyEmail} = require("../middleware/userVerificationExistsOrNot");
const login = require("../services/login");
const { getUserDetailsFromToken, getMultipleUserDetailsById } = require("./../services/getUserDetails");
const {updateProfileController} = require("../controller/userController");

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
//Reset Password
router.post('/reset-password',handleResetPassword);
// //Verify Email exists or not
// router.post('/verify-email',checkUser);

router.get('/get-user-details-from-token', getUserDetailsFromToken);
router.post('/get-multiple-user-details-by-id', getMultipleUserDetailsById)

router.post('/update-profile',updateProfileController)

module.exports = router;