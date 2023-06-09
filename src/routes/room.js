var express =require('express')
var router= express.Router();

const roomController = require('../app/controllers/roomController')


router.get("/", roomController.getAllRoom);
router.get("/showtime-room", roomController.getAllShowTime_Room);
router.post("/", roomController.addRoom);
router.put("/", roomController.editRoom);


module.exports = router;