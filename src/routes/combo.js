var express =require('express')
var router= express.Router();


const comboController = require('../app/controllers/comboController.js')


router.post("/add", comboController.adddCombo);
router.get("/", comboController.getAllCombo);
module.exports = router;