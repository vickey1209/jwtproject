const mongoose = require("mongoose");

const connectDB = async(DATABASE_URL) => {
    try{
        const DB_OPTIONS = {
            dbname:"jwt"
        }
        await mongoose.connect(DATABASE_URL,DB_OPTIONS)
    console.log("DB connected successfully")
  
    }catch(error)
    {
       console.log(error);
    }

}
module.exports  = connectDB