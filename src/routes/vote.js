var express =require('express')
var router= express.Router();


const voteController = require('../app/controllers/voteController.js')


router.post("/", voteController.addVote);
router.get("/", voteController.getAllvote);
router.get("/moive/:id", voteController.getVote_Moive);
// router.put("/edit", comboController.editCombo);
// router.delete("/delete/:id", comboController.editCombo);
module.exports = router;