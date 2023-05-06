var express =require('express')
var router= express.Router();

const moiveController = require('../app/controllers/moiveController')


router.get("/", moiveController.getAllMoive);
router.post("/add-moive", moiveController.addMoive);
router.get("/:moiveId", moiveController.getMoiveId);
router.post("/moive-time", moiveController.getMoivesAndShowTime);


module.exports = router;