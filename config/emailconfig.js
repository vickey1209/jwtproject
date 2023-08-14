const dotenv = require("dotenv")
dotenv.config()
const nodemailer = require("nodemailer")

let transporter = nodemailer.createTransport({
    // host : process.env.EMAIL_HOST,
    service: 'Gmail',
    port : process.env.EMAIL_PORT,
    secure : true,
    auth: {
    user : process.env.EMAIL_USER, 
    pass : process.env.EMAIL_PASS,
},
})
//to verify transporter
// transporter.verify((error, success) => {
//     if (error) {
//       console.error('Error verifying transporter:', error);
//     } else {
//       console.log('Transporter is ready to send emails');
//     }
//   });

module.exports = transporter