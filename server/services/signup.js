const bcrypt = require("bcrypt");
const supabase = require("../model");
const jwt = require("jsonwebtoken");
const { v4 : uuidv4 } = require('uuid');
const { addUser } = require("../services/addUser")

const signup = async (req, res) => {
    try {
        const { username,firstName,lastName,email,password,mobile,address,zipCode } = req.body;
        const uuid = uuidv4();
        console.log(uuid);
        const userLogin = {
            user_id: uuid,
            username: username,
            email: email,
            password: await bcrypt.hash(password, 10)
        };
        const {data,error} = await supabase
            .from('login-details')
            .insert(userLogin)
            .select();
        //if user details is captured
        //generate token with the user's id and the secretKey in the env file
        // set cookie with the token generated
        if (!error) {
            const userRow = data.pop();
            let token = jwt.sign({ id: userRow.id }, process.env.SECRET_KEY, {
                expiresIn: 24 * 60 * 60 * 1000,
            });
            console.log("user", JSON.stringify(userRow, null, 2));
            console.log(token);
            //Adding user details to DB
            const userDetailsToAdd = {
                user_id: uuid,username: username,firstName:firstName,lastName:lastName,email:email,mobile:mobile,address:address,zipcode:zipCode
            };
            const {code, message} = await addUser(userDetailsToAdd);
            //send signup response
            if(code == 200){
                res.cookie("jwt", token, { maxAge: 24 * 60 * 60, httpOnly: true });
                return res.status(200).send("Signed Up Successfully");
            }
        } else {
            return res.status(400).send("Details are not correct");
        }
    } catch (error) {
        console.log(error);
    }
};

module.exports = signup;
