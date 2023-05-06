var express =require('express')
var router= express.Router();
var passport = require('passport')
require("../app/middlewares/passport.js")

const authController = require('../app/controllers/authController')


router.post("/signup", authController.signUp);
router.post("/signin", passport.authenticate('local',{session:false}), authController.signIn);
router.get('/secret',passport.authenticate('jwt',{session:false}),authController.secret);
router.delete('/logout',passport.authenticate('jwt',{session:false}),authController.logOut);
router.post('/edit-avatar',authController.updateAvatar);
router.post('/edit-profile',authController.updateUser);


module.exports = router;