var express =require('express')
var router= express.Router();

const showTimeController = require('../app/controllers/showTimeController')



// router.get("/date", showTimeController.getAllShowTime_Date);
router.get("/", showTimeController.getAllShowTime);
router.get("/show-time/success", showTimeController.getAllShowTimeSuccess);

router.post("/", showTimeController.createShowTime);
router.put("/", showTimeController.editShowTime)
router.get("/:moiveId", showTimeController.getShowTimeMoiveId);
router.get("/show/:showtimeId", showTimeController.getShowTimeId);
router.delete('/:id',showTimeController.deleteShowTime);

module.exports = router;