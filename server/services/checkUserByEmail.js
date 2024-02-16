const supabase = require("../model");

const checkUserByEmail = async(userEmail) => {
    try {
        const {data:userData, error:userDataError} = await supabase
            .from('user-details')
            .select('user_id, email')
            .eq('email', userEmail);
        console.log("checkUserByEmail service userData: ", userData);
        console.log("checkUserByEmail service userDataError: ", userDataError);
        return userData
    } catch(e) {
        console.log('Check user by email error:', e)
        return null
    }
}

module.exports = { checkUserByEmail }