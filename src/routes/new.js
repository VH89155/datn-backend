var express =require('express')
var router= express.Router();


const newController = require('../app/controllers/newController')


router.post("/add", newController.addNew);
router.get("/", newController.getAllnew);
router.get("/:id", newController.getNewID);

router.delete('/:id',newController.delteNew);
router.put("/edit-new", newController.editNew);
module.exports = router;