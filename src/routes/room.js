var express =require('express')
var router= express.Router();

const roomController = require('../app/controllers/roomController')


router.get("/", roomController.getAllRoom);


module.exports = router;