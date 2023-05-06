var express =require('express')
var router= express.Router();

const showTimeController = require('../app/controllers/showTimeController')



// router.get("/date", showTimeController.getAllShowTime_Date);
router.get("/", showTimeController.getAllShowTime);

router.post("/", showTimeController.createShowTime);

router.get("/:moiveId", showTimeController.getShowTimeMoiveId);
router.get("/show/:showtimeId", showTimeController.getShowTimeId);

module.exports = router;