var express =require('express')
var router= express.Router();


const priceTicketController = require('../app/controllers/priceTicketController.js')


router.post("/", priceTicketController.addPriceTicket);
router.get("/", priceTicketController.getAllPriceTicket);


module.exports = router