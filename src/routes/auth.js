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
router.put('/edit-admin',authController.updateUserAdmin);
router.post('/forgot-pass/sendemail',authController.sendEmailForgotPasword);
router.post('/forgot-pass/pass-new',authController.passwordNew);
router.post('/auth/resset-pass',authController.ressetPassword);
router.post('/auth/google', passport.authenticate('google-plus-token',{session:false}),authController.authGoogle );
router.post('/auth/google-new',authController.authGoogle_New );
router.post('/auth/facebook', passport.authenticate('facebook-token',{session:false}),authController.authFacebook );

router.patch('/restore/:id',authController.restoreUser);
router.delete('/force/:id',authController.deleteUserForce);
router.delete('/:id',authController.deleteUser);
router.get("/trash/trash-user",authController.trashUsers);


module.exports = router;