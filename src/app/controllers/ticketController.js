const Moive = require("../models/Moive");
const ShowTime = require("../models/ShowTime");
const Bluebird = require("bluebird");
const Ticket = require("../models/Ticket");
const Room = require("../models/Room");
const User = require("../models/User");
const Combo = require("../models/Combo");


const ticket = async(ticketID)=>{
   const data = await Ticket.findById(ticketID).lean().then(async(ticket)=>{
    
    return {        
        showTime: await ShowTime.findById(ticket.time)
          .lean()
          .then(async (data) => {
            return {
              time: data.time,
              moive: await Moive.findById(data.moive).lean().then((data)=>{
                return {name: data.name, images: data.images, ages:data.ages}
              }),
              room: await Room.findById(data.room).lean(),
            };
          }),
        user: await User.findById(ticket.user).lean().then((data)=>{
            return {username: data.username, email: data.email, fullName: data.fullName,phoneNumber: data.phoneNumber}
          }),
        number: ticket.number,
        price: ticket.price,
        payment: ticket.payment ?? null,
        combo: ticket.combo ?? null
      };
   })
 
   return data
 
}

const ticketController = {
  createTicket: async (req, res) => {
    try {
      const infoTicket = req.body;
      console.log(infoTicket);
      const newTicket = new Ticket(infoTicket);
      const ticket = await newTicket.save();
      console.log(ticket);
      res.status(200).json(ticket);
    } catch (error) {
      res.status(404).json({ error: error });
    }
  },
  getAllTicketUserID: async (req, res) => {
    console.log(req.params.userID);
    try {
      const userID = req.params.userID;
      const tickets = await Ticket.find({ user: userID })
        .lean()
        .then(async (data) => {
                const array1 = await Bluebird.map(data, async(item)=>{
                    return {
                        tiketID: item._id,
                        showTime: await ShowTime.findById(item.time)
                          .lean()
                          .then(async (data) => {
                            return {
                              time: data.time,
                              moive: await Moive.findById(data.moive).lean().then((data)=>{
                                return {name: data.name, images: data.images, ages:data.ages}
                              }),
                              room: await Room.findById(data.room).lean(),
                            };
                          }),
                        user: await User.findById(item.user).lean().then((data)=>{
                            return {username: data.username, email: data.email, fullName: data.fullName,phoneNumber: data.phoneNumber}
                          }),
                        number: item.number,
                        price: item.price,
                        payment: item.payment ?? null,
                        combo: item.combo ?? null
                      };
                }, { concurrency: data.length})

          console.log(array1)
          return array1;
        });
      res.status(200).json(tickets);
    } catch (error) {
      res.status(404).json({ error: error });
    }
  },
 getTicketID:  async(req,res)=>{
  try {
    const tiketID = req.params.tiketID;
    const item = await ticket(tiketID);
    
    res.status(200).json({ticket: item,id : tiketID});
  } catch (error) {
    res.status(404).json({ error: error });
  }
 }
  
};

module.exports = ticketController;
