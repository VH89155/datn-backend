var express =require('express')
var router= express.Router();
var passport = require('passport')
require("../app/middlewares/passport.js")

const ticketController = require('../app/controllers/ticketController.js')


router.post("/add-ticket", ticketController.createTicket);

module.exports = router;