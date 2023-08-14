const usermodel = require("../models/user.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer =require("nodemailer")
const transporter = require("../config/emailconfig.js")

class UserController {

    //user registration

    static userRegistration = async (req, res) => {
        const { name, email, password, confirmpassword, tc } = req.body
        const user = await usermodel.findOne({ email: email })
        // console.log("hello...............")
        if (user) {
            res.send({ "status": "failed", "message": "email already exist" })
        } else {
            if (name && email && password && confirmpassword && tc) {

                if (password === confirmpassword) {
                    try {
                        const salt = await bcrypt.genSalt(10)
                        const hashpassword = await bcrypt.hash(password, salt)
                        const doc = new usermodel({
                            name: name,
                            email: email,
                            password: hashpassword,
                            tc: tc
                        })
                        await doc.save()
                        const saveduser = await usermodel.findOne({ email: email })

                        //generate JWT Token
                        const token = jwt.sign({ userID: saveduser._id },
                            process.env.JWT_SECRET_KEY, { expiresIn: '5d' })

                        res.status(201).send({ "status": "success", "message": "registration success", "token": token , "user":doc })

                    } catch (error) {
                        console.log(error);
                        res.send({ "status": "failed", "message": "Unable to register" })
                    }

                }
                else {
                    res.send({ "status": "failed", "message": "password and confirm password doesnt match" })
                }

            }
            else {
                res.send({ "status": "failed", "message": "all fields are required" })
            }
        }

    }

    //user login

    static userlogin = async (req, res) => {
        try {
            const { email, password } = req.body
            if (email && password) {
                const user = await usermodel.findOne({ email: email })
                if (user != null) {
                    const isMatch = bcrypt.compare(password, user.password)
                    if ((user.email === email) && isMatch) {
                        //generate token 

                        const token = jwt.sign({ userID: user._id },
                        process.env.JWT_SECRET_KEY, { expiresIn: '5d' })

                        res.status(201).send({ "status": "success", "message": "user login successfully", "token": token })
                        console.log("user login successfully", user, token)
                    } else {
                        res.send({ "status": "failed", "message": "email or password is not valid" })
                    }
                }
                else {
                    res.send({ "status": "failed", "message": "all fields are required" })
                }
            }

        } catch (error) {
            res.send({ "status": "failed", "message": "email or password is not valid" })
            console.log("user not registered")

        }
    }

    static changepassword = async (req, res) => {
        const { password, confirmpassword } = req.body
        if (password && confirmpassword) {
            if (password !== confirmpassword) {
                res.send({ "status": "failed", "message": "new password and confirm password doesnot match" })
            }
            else {
                const salt = await bcrypt.genSalt(10)
                const newhashpassword = await bcrypt.hash(password, salt)
                await usermodel.findByIdAndUpdate(req.user._id, {
                    $set: {
                        password: newhashpassword
                    }
                })
                // console.log(req.user)
                console.log(req.user._id)
                res.send({ "status": "success", "message": "password changed successfully" })

            }

        } else {
            res.send({ "status": "failed", "message": "all fields are required" })
        }
    }
    //logged user

    static loggeduser = async (req, res) => {
        res.send({ "user": req.user })
    }

    //password reset
    static passwordresetemail = async (req, res) => {
        const { email } = req.body
        console.log("email" , email)
           console.log("hiiiiiiiiiiiii");        
        if (email) {
            const user = await usermodel.findOne({ email: email });
            console.log(user);

            if (user) {
                const secret = user._id + process.env.JWT_SECRET_KEY
                const token = jwt.sign({ userID: user._id }, secret, { expiresIn: '50m' })
                const link = `http://127.0.0.1:3000/api/user/reset/${user._id}/${token}`
                console.log("user datail", user)
                //link: /api/user/reset/:id/:token
                console.log(link);

                // send email code
                let info = await transporter.sendMail({
                    from : process.env.EMAIL_FROM,
                    to : user.email,
                    subject : "password reset link",
                    html:`<a href = ${link}><a>click here to reset ut password</a>`
                })

                 res.send({ "status": "success", "message": "passsword reset email sent... kindly check email" , "info" : info })

            } 
            else
            {
                res.send({ "status": "failed", "message": "email doesnt exist  " })
            }

        }   
        else {
            res.send({ "status": "failed", "message": "email field is required" })
        }
    }
    static userpasswordreset = async(req, res)=>{
        const{password, confirmpassword} =req.body
        const {id, token} = req.params
        const user = await usermodel.findById(id)
        const newsecret = user._id + process.env.JWT_SECRET_KEY
        try {
            jwt.verify(token , newsecret)
            if(password && confirmpassword)
            {
                
                if(password !== confirmpassword)
                {
                    
                    res.send({"status":"failed", "message":"new password and confirm password doesnt match"})
                }
             
                else{
                        const salt = await bcrypt.genSalt(10)
                        const newhashpassword = await bcrypt.hash(password, salt)
                        await usermodel.findByIdAndUpdate(user._id, {
                            $set: {
                                password: newhashpassword
                            }
                        })
                       
                        res.send({"status":"success", "message":"password reset successfully"})
                        console.log("password", password)
                }

            }

            else{
                res.send({"status":"failed", "message":"all fields are required"})
            }
        } catch (error) {
            res.send({"status":"failed", "message":"invalid token"})
        }
    }


}

module.exports = UserController