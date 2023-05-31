var express =require('express')
var router= express.Router();


const discountController = require('../app/controllers/DiscountController.js')


router.post("/add", discountController.addDiscount);
router.post("/get", discountController.getDiscountID);
router.get("/", discountController.getAllDiscount);
router.get("/:id", discountController.getDiscountIDAdmin);
router.put("/edit", discountController.editdiscount);
router.delete("/delete/:id", discountController.deleteDiscount);
module.exports = router