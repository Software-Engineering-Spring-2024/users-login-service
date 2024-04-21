const supabase = require("../model");
const jwt = require("jsonwebtoken");
const { getUserDetailsById } = require("./getUserDetailsById")
const { getMultipleUserDetailsWithId } = require("./getMultipleUserDetailsWithId")
const { getMultipleUserIdsWithEmail } = require("./getMultipleUserIdsWithEmail")


const getUserDetailsFromToken = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.substring(7, authHeader.length);

            jwt.verify(token, process.env.SECRET_KEY, async (err, user) => {
                if (err) {
                    return res.sendStatus(403);
                }
                console.log('user details from token', user)

                const userDetails = await getUserDetailsById(user.id);
                console.log('user details from Supabase', userDetails)
                return res.status(200).send({ userDetails });
            });
        } else {
            return res.sendStatus(401);
        }
    } catch (e) {
        console.log('Get user details from token error', e)
        return res.sendStatus(401)
    }
}

const getMultipleUserDetailsById = async (req, res) => {
    const body = req.body;
    try {
        const userDetails = await getMultipleUserDetailsWithId(body.userIds);
        console.log('user details from Supabase', userDetails)
        return res.status(200).send({ userDetails });
    } catch (e) {
        console.log('Get user details from token error', e)
        return res.sendStatus(401)
    }
}

const getMultipleUserIdsByEmail = async (req, res) => {
    const body = req.body;
    try {
        const userDetails = await getMultipleUserIdsWithEmail(body.emails);
        console.log('user details from Supabase', userDetails)
        return res.status(200).send({ userDetails });
    } catch (e) {
        console.log('Get user details from token error', e)
        return res.sendStatus(401)
    }
}

module.exports = { getUserDetailsFromToken, getMultipleUserDetailsById, getMultipleUserIdsByEmail }