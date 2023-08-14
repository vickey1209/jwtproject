const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

    name:{
       type: String,
       require: true,
       trim:true
    },
    email:{
        type: String,
       require: true,
       trim:true

    },
    password:{
        type: String,
       require: true,
       trim:true

    },
    tc:{
        type:Boolean,
        require: true
    },
    tokens: [{
        token:{
            type: String,
          required : true}
      
    }],
})

const usermodel = mongoose.model("user",userSchema )
module.exports = usermodel;