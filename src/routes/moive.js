var express =require('express')
var router= express.Router();

const moiveController = require('../app/controllers/moiveController')


router.get("/", moiveController.getAllMoive);
router.post("/add-moive", moiveController.addMoive);
router.get("/:moiveId", moiveController.getMoiveId);
router.post("/moive-time", moiveController.getMoivesAndShowTime);
router.put("/edit-moive", moiveController.editMoive);

router.patch('/restore/:id',moiveController.restoreMoive);
router.delete('/force/:id',moiveController.deleteForceMoive);
router.delete('/:id',moiveController.delteMoive);
router.get("/trash/trash-moive",moiveController.trashMoives);


module.exports = router;