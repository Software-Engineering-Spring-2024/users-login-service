const supabase = require("../model");

const addUser = async(userDetails) => {
    code = 200
    message = 'Added Successfully'
    error = ""
    try {
        const {data:userData,error:userDataError} = await supabase
            .from('user-details')
            .insert(userDetails)
            .select();
        console.log("addUser service userData: ", userData);
        console.log("addUser service userDataError: ", userDataError);
    } catch(e) {
        console.log('Add User Error:', e)
        code = 400
        message = 'Could not add user'
    }
    return {
        code,
        message
    }
}

module.exports = { addUser }