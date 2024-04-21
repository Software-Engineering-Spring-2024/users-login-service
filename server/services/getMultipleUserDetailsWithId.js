const supabase = require("../model");

const getMultipleUserDetailsWithId = async(userIds) => {
    try {
        const {data:userData, error:userDataError} = await supabase
            .from('user-details')
            .select()
            .in('user_id', userIds);
        console.log("getMultipleUserDetailsWithId service userData: ", userData);
        console.log("getMultipleUserDetailsWithId service userDataError: ", userDataError);
        return userData
    } catch(e) {
        console.log('Get User details by ID error:', e)
        return null
    }
}

module.exports = { getMultipleUserDetailsWithId }