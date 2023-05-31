var express =require('express')
var router= express.Router();


const comboController = require('../app/controllers/comboController.js')


router.post("/add", comboController.adddCombo);
router.get("/", comboController.getAllCombo);
router.get("/:id", comboController.getComboID);
router.put("/edit", comboController.editCombo);
router.delete("/delete/:id", comboController.editCombo);
module.exports = router;