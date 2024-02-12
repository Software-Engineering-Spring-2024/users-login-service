
//importing modules

const bcrypt = require("bcrypt");
const supabase = require("../model");
const jwt = require("jsonwebtoken");

// Assigning users to the variable User
// const User = db.users;

//signing a user up
//hashing users password before its saved to the database with bcrypt
const signup = async (req, res) => {
    try {
        const { username,firstName,lastName,email,password,mobile,address,zipCode } = req.body;
        const userLogin = {
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
            const userDetails = {
                username: username,firstName:firstName,lastName:lastName,email:email,mobile:mobile,address:address,zipcode:zipCode,userId:userRow.id
            };
            const {data:userData,error:userDataError} = await supabase
                .from('user-details')
                .insert(userDetails)
                .select();
            console.log(userData);
            console.log(userDataError);
            //send signup response
            if(!userDataError){
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


//login authentication

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        //find a user by their email
        const {data:users,error} = await supabase
            .from('login-details')
            .select('id,password')
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
                return res.status(200).send("Login Successful");
            } else {
                return res.status(400).send("Invalid Password");
            }
        } else {
            return res.status(400).send("Invalid Username/Password");
        }
    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    signup,
    login,
};