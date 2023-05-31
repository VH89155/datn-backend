var express =require('express')
var router= express.Router();
var passport = require('passport')
require("../app/middlewares/passport.js")

const statisticalController = require('../app/controllers/statisticalController.js')

router.get("/", statisticalController.getTotalDay);
router.get("/moive/totalAll", statisticalController.getTotalMovie);
router.get("/total/:year", statisticalController.getTotalYears);
router.get("/total-month/:month", statisticalController.getTotalDaysMonth);
router.get("/fullMonth", statisticalController.getTotalFullMonth);




module.exports = router;