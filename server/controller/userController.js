
//importing modules

const bcrypt = require("bcrypt");
const supabase = require("../model");
const jwt = require("jsonwebtoken");
const { addUser } = require("../services/addUser")
const { checkUserByEmail } = require("../services/checkUserByEmail")
const { v4: uuidv4 } = require('uuid');

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
            return res.status(200).send("Signed In Successfully");
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
            return res.status(code).send("Signed In Successfully");
        }

    } catch (error) {
        console.log("handleGoogleOAuth error", error);
        return res.status(401).send("Unable to Sign In");
    }
}

module.exports = {
    handleGoogleOAuth,
};