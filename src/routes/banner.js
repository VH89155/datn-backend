var express =require('express')
var router= express.Router();


const bannerController = require('../app/controllers/bannerController.js')


router.post("/", bannerController.addBanner);
router.get("/", bannerController.getAllBanner);

router.put("/edit", bannerController.editBanner);

module.exports = router;