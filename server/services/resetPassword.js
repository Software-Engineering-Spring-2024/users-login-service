const {checkUserByEmail} = require("./checkUserByEmail");
const supabase = require('../model');
const {LOGIN_DETAILS, PASSWORD} = require("../constants/constants");
const bcrypt = require("bcrypt");
async function changePasswordInDB(email,newPassword) {
    try{
        const encryptedPassword = await bcrypt.hash(newPassword, 10)
       const {status,error} = await supabase
           .from(LOGIN_DETAILS)
           .update({password : encryptedPassword})
           .eq('email',email);
       if(status===204){
           return {message:'Updated Password Successfully',code:200};
       }
       return {message:'Please Try Again',code:500};
    }
    catch (e){
        return errorResponse(e.message);
    }
}

function errorResponse(message) {
    return {message:message,code:500};
}

const resetPassword = (email,newPassword) => {
    const emailCheck = checkUserByEmail(email);
    return emailCheck ? changePasswordInDB(email,newPassword):errorResponse('Email Error');
}
module.exports = {resetPassword};