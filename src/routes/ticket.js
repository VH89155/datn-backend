var express =require('express')
var router= express.Router();
var passport = require('passport')
require("../app/middlewares/passport.js")

const ticketController = require('../app/controllers/ticketController.js')

router.post("/add-ticket", ticketController.createTicket);
router.get("/user/:userID",ticketController.getAllTicketUserID)
router.get("/ticket/:tiketID",ticketController.getTicketID)
router.get("/ticket-all/:query",ticketController.getAlllTicket)
router.put("/ticket-accuracy/:query",ticketController.accuracyTicket)
router.put("/ticket-cancel/:query",ticketController.cancelTicket)
router.delete("/ticket-delete/:query",ticketController.deleteTicket)




module.exports = router;