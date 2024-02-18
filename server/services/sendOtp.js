
const constants = require('../constants/constants');
const nodemailer = require('nodemailer');
const otpGenerator = require('otp-generator');
const {send} = require("express/lib/response");
const {verifyEmail} = require("../middleware/userVerificationExistsOrNot");

let transporter = nodemailer.createTransport({
    service: constants.GMAIL,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.APP_PASSWORD,
    },
});

function setMailContext(email, otp) {
    return {
        from: process.env.EMAIL,
        to: email,
        subject: 'Your Verification Code',
        text: `Your OTP is: ${otp}`,
    }
}

const sendOtp = async (req,res) => {
    const {email} = req.body;
    console.log(email);
    try {
        const emailList = await verifyEmail(email);
        if(emailList.length === 0){
            return res.status(500).send({message:"Not a Registered Email"});
        }
    }
    catch (e){
        console.log(e);
    }
    const otp = generateOtp();
    const mailContext = setMailContext(email,otp);
    console.log(mailContext);
    console.log(process.env.EMAIL,process.env.APP_PASSWORD);
    try {
        const {error, info} = await sendMail(mailContext);
        if (error) {
            return res.status(500).send({message: "Some Error, Please Try Again!!!"});
        }
        // If no error, send success response
        return res.status(200).send({message: "OTP Successfully Sent!!", messageId: info.messageId, otp:otp});
    } catch (err) {
        // Handle unexpected errors
        return res.status(500).send({message: "An unexpected error occurred."});
    }
}

function generateOtp(){
    return otpGenerator.generate(5,{digits:true,lowerCaseAlphabets:false,upperCaseAlphabets:false,specialChars : false});
}
async function sendMail (mailOptions)  {
    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            console.log(error);
            console.log(info);
            if (error) {
                return resolve({error});
            }
            resolve({info});
        });
    });
}

module.exports = sendOtp;