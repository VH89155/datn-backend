const Moive = require("../models/Moive");
const ShowTime = require("../models/ShowTime");
const Bluebird = require("bluebird");
const Ticket = require("../models/Ticket");
const Room = require("../models/Room");
const User = require("../models/User");
const Combo = require("../models/Combo");
const QRCode = require("qrcode");
const sendEmail = require("../../config/email/sendEmail");
const Discount = require("../models/Discount");
const Bill = require("../models/Bill");
const DetailCombo = require("../models/DetailCombo");
const DetailTicket = require("../models/DetailTicket");
const ObjectId = require('mongodb').ObjectId;



const TicketMonth = (ticket,month)=>{
   let TicketMonth = ticket.map((item) => {
    const time = new Date(item.createdAt);
    console.log(month , time.getMonth()+1);
    if (month  == time.getMonth()+1) {
      return {
        _id: item._id,
        time: time._id,
        number: item.number,
        soghe: item.number.length,
        DetailTickets: item.Detailtickets,
        tienVe: item.Detailtickets.reduce(
          (total, item) => total + item.price,
          0
        ),
        tongTien: item.bills[0].price,
        payment: item.bills[0].payment,
        user: item.user,
        time: `${time.getDate()}-${
          time.getMonth() + 1
        }-${time.getFullYear()}`,
      };
    }
    if (time.getTime() < timeNow.getTime()) {
      return false;
    }
  });
  TicketMonth = TicketMonth.filter(Boolean);

  let TotalVe = TicketMonth.reduce((total, item) => {
    return total + item.tienVe;
  }, 0);
  let Total = TicketMonth.reduce((total, item) => total + item.tongTien, 0);
  let tongGhe = TicketMonth.reduce((total,item)=> total+ item.number.length,0);    
  return { Total: Total, TotalVe: TotalVe,tongGhe:tongGhe}
}
const TicketDay = (ticket,date,month)=>{
  let TicketDay = ticket.map((item) => {
    const time = new Date(item.createdAt); 
  
    if (month  == time.getMonth()+1 && time.getDate() == date && time.getFullYear()=== 2023) {
      return {
        _id: item._id,
        time: time._id,
        number: item.number,
        soghe: item.number.length,
        DetailTickets: item.Detailtickets,
        tienVe: item.Detailtickets.reduce(
          (total, item) => total + item.price,
          0
        ),
        tongTien: item.bills[0].price,
        payment: item.bills[0].payment,
        user: item.user,
        time: `${time.getDate()}-${
          time.getMonth() + 1
        }-${time.getFullYear()}`,
      };
    }
    if (time.getTime() < timeNow.getTime()) {
      return false;
    }
  });
  TicketDay = TicketDay.filter(Boolean);

  let TotalVe = TicketDay.reduce((total, item) => {
    return total + item.tienVe;
  }, 0);
  let Total = TicketDay.reduce((total, item) => total + item.tongTien, 0);
  let tongGhe = TicketDay.reduce((total,item)=> total+ item.number.length,0);    
  return { Total: Total, TotalVe: TotalVe,tongGhe:tongGhe}
}


let timeNow = new Date();
timeNow.setHours(0);
timeNow.setMinutes(0);
const statisticalController = {
  getTotalDay: async (req, res) => {
    try {
      let ticket = await Ticket.aggregate([
        {
          $lookup: {
            from: "detailtickets",
            localField: "_id",
            foreignField: "ticket",
            as: "Detailtickets",
          },
        },
        {
          $lookup: {
            from: "bills",
            localField: "_id",
            foreignField: "ticket",
            as: "bills",
          },
        },
      ]);
      let TicketToday = ticket.map((item) => {
        const time = new Date(item.createdAt);
        console.log(time.getTime() > timeNow.getTime());
        if (time.getTime() >= timeNow.getTime()) {
          return {
            _id: item._id,
            time: time._id,
            number: item.number,
            soghe: item.number.length,
            DetailTickets: item.Detailtickets,
            tienVe: item.Detailtickets.reduce(
              (total, item) => total + item.price,
              0
            ),
            tongTien: item.bills[0].price,
            payment: item.bills[0].payment,
            user: item.user,
            time: `${time.getDate()}-${
              time.getMonth() + 1
            }-${time.getFullYear()}`,
          };
        }
        if (time.getTime() < timeNow.getTime()) {
          return false;
        }
      });
      TicketToday = TicketToday.filter(Boolean);
      //    console.log(TicketToday)

      let TotalVe = TicketToday.reduce((total, item) => {
        return total + item.tienVe;
      }, 0);
      let Total = TicketToday.reduce((total, item) => total + item.tongTien, 0);
      let tongGhe = TicketToday.reduce((total,item)=> total+ item.number.length,0);
      //  return res.status(200).json(ticket)
      return res
        .status(200)
        .json({ Total: Total, TotalVe: TotalVe,tongGhe:tongGhe, VeToday: TicketToday });
    } catch (err) {
      console.log(err);
      res.status(404).json("errr");
    }
  },
  getTotalYears:  async (req, res) => {
    try {
      const year = req.params.year
      let ticket = await Ticket.aggregate([
        {
          $lookup: {
            from: "detailtickets",
            localField: "_id",
            foreignField: "ticket",
            as: "Detailtickets",
          },
        },
        {
          $lookup: {
            from: "bills",
            localField: "_id",
            foreignField: "ticket",
            as: "bills",
          },
        },
      ]);
      let TicketYears = ticket.map((item) => {
        const time = new Date(item.createdAt);
        console.log(year , time.getFullYear());
        if (year  == time.getFullYear()) {
          return {
            _id: item._id,
            time: time._id,
            number: item.number,
            soghe: item.number.length,
            DetailTickets: item.Detailtickets,
            tienVe: item.Detailtickets.reduce(
              (total, item) => total + item.price,
              0
            ),
            tongTien: item.bills[0].price,
            payment: item.bills[0].payment,
            user: item.user,
            time: `${time.getDate()}-${
              time.getMonth() + 1
            }-${time.getFullYear()}`,
          };
        }
        if (time.getTime() < timeNow.getTime()) {
          return false;
        }
      });
      TicketYears = TicketYears.filter(Boolean);
   
      let TotalVe = TicketYears.reduce((total, item) => {
        return total + item.tienVe;
      }, 0);
      let Total = TicketYears.reduce((total, item) => total + item.tongTien, 0);
      let tongGhe = TicketYears.reduce((total,item)=> total+ item.number.length,0);    
      return res
        .status(200)
        .json({ Total: Total, TotalVe: TotalVe,tongGhe:tongGhe, VeToday: TicketYears });
    } catch (err) {
      console.log(err);
      res.status(404).json("errr");
    }
  },


  getTotalFullMonth:  async (req, res) => {
    try {
      
      let ticket = await Ticket.aggregate([
        {
          $lookup: {
            from: "detailtickets",
            localField: "_id",
            foreignField: "ticket",
            as: "Detailtickets",
          },
        },
        {
          $lookup: {
            from: "bills",
            localField: "_id",
            foreignField: "ticket",
            as: "bills",
          },
        },
      ]);
     let ArrayTotalMonth =[]
      for (let i=1; i<=12;i++){
          ArrayTotalMonth.push({
            month: i,
            total: TicketMonth(ticket,i) 
          })
      }
   return res.status(200).json(ArrayTotalMonth)
    } catch (err) {
      console.log(err);
      res.status(404).json("errr");
    }
  },


  getTotalMovie: async (req, res) => {
    try {
      let allShowTime = await ShowTime.aggregate([
        {
          $lookup: {
            from: "tickets",
            localField: "_id",
            foreignField: "time",
            as: "tickets",
          },
        },
       
      ]);
      allShowTime = allShowTime.filter((item) => item.tickets.length > 0);
     
      let totalAllShowTime = await Bluebird.map(
        allShowTime,
       async(item) => {
       
          const totalShowtime = item.tickets.map(async (ticket) => {
            const tienVe = await DetailTicket.find({ ticket: ticket._id })
              .lean()
              .then((data) => {
                return data.reduce((total, item) => total + item.price, 0);
              });

            return {
              soghe: ticket.number.length,
              tienVe: tienVe,
            };
          });
          let tongghe = 0;
          let tongTienVe = 0;
          const data = Promise.all(totalShowtime).then(async(data) => {
            // console.log("data",data)
            (tongghe = data?.reduce((total, item) => total + item.soghe, 0)),
              (tongTienVe = data?.reduce(
                (total, item) => total + item.tienVe,
                0
              ));
            return {
              _id: item._id,
               moive: item.moive,
              Tongsoghe: tongghe,
              tongTienVe: tongTienVe,
            };
          });
          // console.log(totalShowtime);
          return data;
        },
        { concurrency: allShowTime.length }
      );
    
      const moives = await Moive.find().lean().then(async(data)=>{
       const arr = await  Bluebird.map(data,(item)=>{
        const id1 = ObjectId(item._id)
        const totalGhe  = totalAllShowTime.reduce((total1,item)=> {
        const id2 = ObjectId(item.moive)
        if(id1.equals(id2))
         return total1 + item.Tongsoghe
        else return total1 + 0        }
        
         ,0)
         const totalTienVe  = totalAllShowTime.reduce((total1,item)=> {
          const id2 = ObjectId(item.moive)
          if(id1.equals(id2))
           return total1 + item.tongTienVe
          else return total1 + 0        }
          
           ,0)
             
          // console.log("total", total)
            return{
               _id:item._id,
               name:item.name,
                
                tongGhe: totalGhe,
                tongTienVe: totalTienVe
            }
        },{concurrency:data.length})
        return arr
      })
      console.log(moives)
    
    
      return res.status(200).json(moives);
    } catch (error) {
      console.log(error);
      return res.status(404).json("errr");
    }
  },

  getTotalDaysMonth:  async (req, res) => {
    try {
        const month = req.params.month
      let ticket = await Ticket.aggregate([
        {
          $lookup: {
            from: "detailtickets",
            localField: "_id",
            foreignField: "ticket",
            as: "Detailtickets",
          },
        },
        {
          $lookup: {
            from: "bills",
            localField: "_id",
            foreignField: "ticket",
            as: "bills",
          },
        },
      ]);
     let ArrayTotalMonth =[]
     if(month === "1" || month === "3" || month === "5" || month === "7"|| month === "8" || month === "10" || month === "12"){
      for (let i=1; i<=31;i++){
        ArrayTotalMonth.push({
          day:i,
          month: month,
          total: TicketDay(ticket,i,month) 
        })
      }
     }
      else if(month === "4" || month === "6" || month === "9" || month === "11"){
      for (let i=1; i<=30;i++){
        ArrayTotalMonth.push({
          day:i,
          month: month,
          total: TicketDay(ticket,i,month) 
        })
      }
      
     }
     else if(month === "2"){
      for (let i=1; i<=28;i++){
        ArrayTotalMonth.push({
          day:i,
          month: month,
          total: TicketDay(ticket,i,month) 
        })
      }
      
     }
      
   return res.status(200).json(ArrayTotalMonth)
    } catch (err) {
      console.log(err);
      res.status(404).json("errr");
    }
  },
  
};

module.exports = statisticalController;
