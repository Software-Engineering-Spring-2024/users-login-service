const supabase = require("../model");

const updateUserDetails = async (req,uid) => {

    code = 200
    message = 'Updated Successfully'
    error = ""
    try {
        console.log(req)
        const {data: userData, error: userDataError} = await supabase
            .from('user-details')
            .update(req)
            .eq('user_id',uid);
        console.log("updateUserDetails service userData: ", userData);
        console.log("updateUserDetails service userDataError: ", userDataError);
        if(userDataError){
            throw new Error();
        }
    } catch (e) {
        console.log('Update User Error:', e)
        code = 400
        message = 'Could not update user'
    }
    return {
        code,
        message
    }
}
module.exports = updateUserDetails;