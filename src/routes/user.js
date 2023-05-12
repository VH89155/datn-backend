var express =require('express')
var router= express.Router();



const userController = require('../app/controllers/userController.js')


router.get("/", userController.getAllUsers);


module.exports = router;