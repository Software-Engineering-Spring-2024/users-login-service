
//importing modules

const bcrypt = require("bcrypt");
const supabase = require("../model");
const jwt = require("jsonwebtoken");
const { addUser } = require("../services/addUser")
const { checkUserByEmail } = require("../services/checkUserByEmail")
const {resetPassword} = require('../services/resetPassword')
const { v4: uuidv4 } = require('uuid');
const updateUserDetails = require("../services/updateUserDetails");

const handleGoogleOAuth = async(req, res) => {
    try {
        const userDetails = req.body;
        console.log("handleGoogleOAuth userDetails:", userDetails)

        const userRecord = await checkUserByEmail(userDetails.email)
        console.log("handleGoogleOAuth userRecord:", userRecord)

        if(userRecord.length > 0) {
            let token = jwt.sign({ id: userRecord[0].user_id }, process.env.SECRET_KEY, {
                expiresIn: 24 * 60 * 60 * 1000,
            });
            res.cookie("jwt", token, { maxAge: 24 * 60 * 60, httpOnly: true });
            return res.status(200).send({message: "Signed In Successfully", token});
        }
        // return res.status(200).send('Testing google auth')
        console.log("User not found, need to add user")
        const userDetailsToAdd = {
            username: userDetails.fullName,
            firstName:userDetails.givenName,
            lastName:userDetails.familyName,
            email: userDetails.email,
            mobile: null,
            address: null,
            zipcode: null,
            user_id: uuidv4()
        }
        const {code, message} = await addUser(userDetailsToAdd);
        //send signup response
        if(code == 200){
            let token = jwt.sign({ id: userDetailsToAdd.user_id }, process.env.SECRET_KEY, {
                expiresIn: 24 * 60 * 60 * 1000,
            });
            res.cookie("jwt", token, { maxAge: 24 * 60 * 60, httpOnly: true });
            return res.status(code).send({message: "Signed In Successfully", token});
        }

    } catch (error) {
        console.log("handleGoogleOAuth error", error);
        return res.status(401).send("Unable to Sign In");
    }
}

const handleResetPassword = async(req,res) => {
    try {
        const request = req.body;
        console.log(request);
        let email;
        const newPassword = request.password;
        if(request.email){
            email = request.email;
        }
        else{ throw new Error('Invalid Email');}
        const response = await resetPassword(email,newPassword);
        if(response.code === 200){
            return res.status(response.code).send(response);
        }
        return res.send(response.code).send(response);
    }
    catch (e){
        return res.status(500).send(e.message);
    }
}

const updateProfileController = async(req,res) => {
    try{
        const request = req.body;
        const uid = req.query.user_id;
        const response = await updateUserDetails(request,uid);
        let token = jwt.sign({ id: uid }, process.env.SECRET_KEY, {
            expiresIn: 24 * 60 * 60 * 1000,
        });
        res.cookie("jwt", token, { maxAge: 24 * 60 * 60, httpOnly: true });
        return res.status(response.code).send(response.message);
    }
    catch (e){
        return res.status(500).send(e.message);
    }
}

module.exports = {
    handleGoogleOAuth,handleResetPassword,updateProfileController
};