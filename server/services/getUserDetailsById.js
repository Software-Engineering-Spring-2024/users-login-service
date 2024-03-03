const supabase = require("../model");

const getUserDetailsById = async(id) => {
    try {
        const {data:userData, error:userDataError} = await supabase
            .from('user-details')
            .select()
            .eq('user_id', id);
        console.log("getUserDetailsById service userData: ", userData);
        console.log("getUserDetailsById service userDataError: ", userDataError);
        return userData
    } catch(e) {
        console.log('Get User details by ID error:', e)
        return null
    }
}

module.exports = { getUserDetailsById }