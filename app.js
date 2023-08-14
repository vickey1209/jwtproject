const dotenv = require('dotenv');
dotenv.config()

const cors =require("cors")
const express = require("express")

const app = express()
const connectDB = require("./config/connectdb.js")
const userroutes =require("./routes/userroutes.js")
const DATABASE_URL = process.env.DATABASE_URL
const port = process.env.PORT

//cors policy
app.use(cors())

//databse connection
connectDB(DATABASE_URL)
//JSON
app.use(express.json())
//LOAD ROUTES
app.use("/api/user", userroutes)

app.listen(port,()=>{
    console.log(`server is running at ${port} successfully` );
})