var express =require('express')
var router= express.Router();


const payPalController = require('../app/controllers/payPalController.js')


router.post("/pay", payPalController.thanhToanPay);
router.post("/success", payPalController.PayPalSuccess);
router.get("/cancel", payPalController.PayPalError);



module.exports = router;