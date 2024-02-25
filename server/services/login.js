
//importing modules

const bcrypt = require("bcrypt");
const supabase = require("../model");
const jwt = require("jsonwebtoken");


//login authentication

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        //find a user by their email
        const {data:users,error} = await supabase
            .from('login-details')
            .select('user_id, password')
            .eq('email',email);

        //if user email is found, compare password with bcrypt
        if (users.length > 0) {
            const user = users.pop();
            const isSame = await bcrypt.compare(password, user.password);

            //if password is the same
            //generate token with the user's id and the secretKey in the env file

            if (isSame) {
                let token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, {
                    expiresIn: 24 * 60 * 60 * 1000,
                });

                //if password matches wit the one in the database
                //go ahead and generate a cookie for the user
                res.cookie("jwt", token, { maxAge: 24 * 60 * 60, httpOnly: true });
                console.log("user", JSON.stringify(user, null, 2));
                console.log(token);
                //send user data
                return res.status(200).send({message:"Login Successful"});
            } else {
                return res.status(400).send({message:"Invalid Password"});
            }
        } else {
            return res.status(400).send({message:"Invalid Username/Password"});
        }
    } catch (error) {
        console.log(error);
    }
};
module.exports = login;
