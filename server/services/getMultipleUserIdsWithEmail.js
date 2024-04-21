const supabase = require("../model");

const getMultipleUserIdsWithEmail = async(emails) => {
    try {
        const {data:userData, error:userDataError} = await supabase
            .from('user-details')
            .select('user_id')
            .in('email', emails);
        console.log("getMultipleUserIdsWithEmail service userData: ", userData);
        console.log("getMultipleUserIdsWithEmail service userDataError: ", userDataError);
        return userData
    } catch(e) {
        console.log('Get User details by ID error:', e)
        return null
    }
}

module.exports = { getMultipleUserIdsWithEmail }