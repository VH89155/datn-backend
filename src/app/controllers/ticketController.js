const Moive = require("../models/Moive");
const ShowTime = require("../models/ShowTime");
const Bluebird = require("bluebird")
const Ticket = require("../models/Ticket");


const ticketController = {
    createTicket:async (req, res) => {

        try {
            const infoTicket = req.body;
            console.log(infoTicket);
            const newTicket = new Ticket(infoTicket)
           const ticket =  await newTicket.save();
           console.log(ticket)
           res.status(200).json(ticket)

        } catch (error) {
            res.status(404).json({ error: error})
        }
    }
}




module.exports = ticketController;