//importing modules
const express = require("express");
const supabase = require("../model");
//Function to check if username or email already exist in the database
const checkUser = async (req, res, next) => {
    //search the database to see if user exist
    try {
        const { userName, email} = req.body;
        const {data:userNameExists,error:usernameError} = await supabase
            .from('login-details')
            .select('username')
            .eq('username',userName);
        //if username exist in the database respond with a status of 409
        if (userNameExists.length>0) {
            return res.status(409).json({message:"username already taken"});
        }
        //checking if email already exists
        const {data:emailCheck,error:emailError} = await supabase
            .from('login-details')
            .select('email')
            .eq('email',email);
        //if email exist in the database respond with a status of 409
        if (emailCheck.length>0) {
            return res.status(409).json({message:"An account with this email already exists"});
        }

        next();
    } catch (error) {
        console.log(error);
    }
};

//exporting module
module.exports = {
    checkUser,
};