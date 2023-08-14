const express =require("express")
const router = express.Router();
const UserController = require("../controllers/usercontroller.js");
const checkUserAuth = require("../middlewares/auth.js");

//routes level middleware - to protect route
router.use('/changepassword', checkUserAuth)
router.use('/loggeduser', checkUserAuth)

//public routes
router.post('/register', UserController.userRegistration)
router.post('/login', UserController.userlogin)   
router.post('/resetpasswordemail', UserController.passwordresetemail)  
router.post('/resetpassword/:id/:token', UserController.userpasswordreset)


//protected routes
router.post('/changepassword' , UserController.changepassword )
router.get('/loggeduser', UserController.loggeduser)
 

module.exports = router