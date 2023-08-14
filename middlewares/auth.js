const jwt = require("jsonwebtoken")
const usermodel = require("../models/user.js");

var checkUserAuth = async (req , res , next) =>{
    let token;
    const {authorization} = req.headers
    
    //get token from header

    if(authorization && authorization.startsWith('Bearer'))
    {
        
        try {
            token = authorization.split(' ')[1];
          
        //   console.log("token:" , token)
        //   console.log("authorization:" , authorization)
          
        //verify token
          const {userID} = jwt.verify(token , process.env.JWT_SECRET_KEY)
         console.log("USER ID IS :" , userID);
          //get user from token
          req.user = await usermodel.findById(userID).select('-password')
          next()
        } catch (error) {
            console.log(error);
            return res.send({"status" : "failed" ,"message":"unauthorized user"})            
        }

    }
    if(!token)
    {
       return res.status(401).send({"status" : "failed" ,"message":"unauthorized user no token"})  
    }

}

module.exports = checkUserAuth