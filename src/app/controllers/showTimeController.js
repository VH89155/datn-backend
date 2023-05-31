const ShowTime = require("../models/ShowTime");
const Moive = require("../models/Moive");
const Bluebird = require("bluebird");
const Room = require("../models/Room");
const Ticket = require("../models/Ticket");
const Combo = require("../models/Combo");
const Bill = require("../models/Bill");
const Discount = require("../models/Discount");
const DetailCombo = require("../models/DetailCombo");
const sendEmail = require("../../config/email/sendEmail");
const User = require("../models/User");


let timeNow = new Date();


const showTimeController = {
  getAllShowTimeSuccess :async (req,res)=>{
      try{
        const showtime = await ShowTime.find({status: true}).lean().then(async(data)=>{
            const showTime = await Bluebird.map(data, async(item)=>{
            
            const moive = await Moive.findById(item.moive).lean()
           
            return{
              _id: item._id,
              status: item.status,
              time:item.time,
              room: item.room,
              moive: moive
             

            }

           },{ concurrency: data.length})
           return showTime
        })

        const array = ShowTime.aggregate([
          {$lookup:{
            from: "Moive",
            localField: "moive",
            foreignField: "_id",
            as: "movieShowTime"
          }
          },{
            $match : 
            { 
              status :true 
            }
          
          }


          
        ])
        console.log(array)
        res.status(200).json(showtime);
      }catch(err){
        res.status(404).json(err)
      }
  },

  getAllShowTime: async (req, res) => {
    try {
      
      await ShowTime.find().then( async(data)=>{
        data.map(async(item)=>{
          const time = new Date(item.time)
          if(time.getTime() + 14400000  < timeNow.getTime()){
             await ShowTime.findByIdAndUpdate(item._id,{
                $set :{
                  status: true
                }
              })
            await Ticket.updateMany(
              {"time": item._id },
              {
                $set:{
                  status: true
                }
              }
              )
          }
        })
      });
      const showTime = await ShowTime.find()
      console.log(showTime[1].time.getHours());
      res.status(200).json({ showTime });
    } catch (err) {
      res.status(401).json(err);
    }
  },
  createShowTime: async (req, res, next) => {
    console.log(req.body);
    try {
      let statusError = "";
      let statusSucsses = null;
      let { moiveId, time, roomId } = req.body;
      time = new Date(time);
      console.log(time.getHours());
      const moive = await Moive.findById(moiveId);
      const room = await Room.findById(roomId);
      if(time.getTime()<timeNow.getTime()) {
        statusError = "Thời gian chiếu không thể là lịch sử";
      }
      if (moive) {
        const premiere_date = new Date(moive.premiere_date);
        if (time.getTime() >= premiere_date.getTime()) {
          console.log("TM", time.getTime() - premiere_date.getTime());
          // res.status(200).json("Ok")
        } else if (time.getTime() < premiere_date.getTime()) {
          console.log("Loi", time.getTime() - premiere_date.getTime());
          statusError = "Lỗi: Lịch chiếu phải lớn hơn ngày chiếu";
          // res.status(200).json("Loi ngay chieu");
        }
      }
      if(moive.display_technology !== room.category){
        statusError = "Lỗi: kiểu phòng chiếu không thích hợp với bộ phim này";
      }
      if (statusError === "" && roomId) {
        const moiveRoom = await ShowTime.find({ room: { $in: roomId } }).lean();
        if (moiveRoom) {
          const array = moiveRoom.filter((item) => {
            const timeItem = new Date(item.time);
            if (Math.abs(time.getTime() - timeItem.getTime()) < 14400000) {
              console.log("Loi: Room");
              return true;
            } else if (Math.abs(time.getTime() - timeItem.getTime()) > 14400000)
              return false;
          });
          console.log(array.length);
          if (array.length === 0) {
            const showTime = await ShowTime({
              moive: req.body.moiveId,
              time: req.body.time,
              room: req.body.roomId,
            });
            console.log(showTime);
            const newShowTime = await showTime
              .save()
              .then((data) => (statusSucsses = data));
          } else if (array.length > 0) {
            statusError = "Lỗi: phòng chiếu hiện đang được sử dụng";
          }
        }
      }
     

      
      res.status(200).json({ statusError, statusSucsses });
    } catch (err) {
      console.log(err);
      res.status(401).json(err);
    }
  },

  editShowTime: async (req, res, next) => {
    console.log(req.body);
    try {
      let statusError = "";
      let statusSucsses = null;
      let { moiveId, time, roomId,showTimeID } = req.body;
      time = new Date(time);
      console.log(time.getHours());
      const moive = await Moive.findById(moiveId);
      if(time.getTime()<timeNow.getTime()) {
        statusError = "Thời gian chiếu không thể là lịch sử";
      }
      if (moive) {
        const premiere_date = new Date(moive.premiere_date);
        if (time.getTime() >= premiere_date.getTime()) {
          console.log("TM", time.getTime() - premiere_date.getTime());
          // res.status(200).json("Ok")
        } else if (time.getTime() < premiere_date.getTime()) {
          console.log("Loi", time.getTime() - premiere_date.getTime());
          statusError = "Lỗi ngày chiếu";
          // res.status(200).json("Loi ngay chieu");
        }
      }

      if (statusError === "" && roomId) {
        const showtime = await ShowTime.findById(showTimeID).lean();
        let moiveRoom = await ShowTime.find({ room: { $in: roomId },time :{$ne: showtime.time}  }).lean();
        
        if (moiveRoom) {
          const array = moiveRoom.filter((item) => {
            const timeItem = new Date(item.time);
            
            if (Math.abs(time.getTime() - timeItem.getTime()) < 14400000) {
              console.log("Loi Room");
              return true;
            } else if (Math.abs(time.getTime() - timeItem.getTime()) > 14400000)
              return false;
          });
          console.log(array.length);
          if (array.length === 0) {
            const showTimeNew = await ShowTime.findByIdAndUpdate(
              showTimeID , 
             {
               $set:{
                  moive:moiveId,
                  time: time,
                  room: roomId,
              }
            }
            ).then(async(data) =>{
              const time = new Date(data.time)
                const moive = await Moive.findById(data.moive).lean()
               await Ticket.find({time:showTimeID }).lean().then(async(arrayTickets)=>{
                  arrayTickets.map(async(ticket)=>{
                    const user = await User.findById(ticket.user).lean()
                    const link =`CSV thành thật xin lỗi bạn về sự bất tiện này: Khung giờ chiếu phim của bạn đã được thay đổi
                     Tên phim : ${moive.name}
                     Thời gian thay đổi lại:  ${time.getHours()} : ${time.getMinutes()} - Ngày ${time.getDate()}/${time.getMonth()+1}/${time.getFullYear()} 
                     Chi tiết bạn hãy chi cập vào mục Vé của bạn trên Website
                     Chúng t chân thành xin lỗi về sự bất tiện này !
                    
                     `
                    
                    console.log(link)
                    await sendEmail(user.email, "Thay đổi lịch chiếu", link);
                  })
              })


              
              statusSucsses = data});
            

          } else if (array.length > 0) {
            statusError = "Lỗi phòng chiếu hiện đang được sử dụng";
          }
        }
      }

      
      res.status(200).json({ statusError, statusSucsses });
    } catch (err) {
      console.log(err);
      res.status(401).json(err);
    }
  },

  deleteShowTime: async (req,res,next)=>{
    try {
      const timeNow = new Date()
      const showtime = await ShowTime.findById(req.params.id).lean()
      const time = new Date(showtime.time)
      const arrayTickets = await Ticket.find({time: req.params.id}).then()
      if(arrayTickets.length >0 && timeNow.getTime()> time.getTime() + 30400000){
        return res.status(200).json({success:false,status:"Đã có vé đặt lịch chiếu này, hãy giải quyết trước khi quay lại xóa !"});
       }
      const deleted = await ShowTime.delete({ _id:{$in: req.params.id}}).then(async()=>{
       
       
        const arrayTickets = await Ticket.find().lean()
        arrayTickets.map(async(item)=>{
         await Ticket.delete({ time: {$in:req.params.id }})
        })
     })
   
   
      
     return res.status(200).json({success:true,status:"Deleted success !"});
     
    }catch (error) {
      console.log(error);
      res.status(401).json(error);
    }
  },

  getShowTimeMoiveId: async (req, res) => {
    console.log(req.body);
    try {
      await ShowTime.find().then( async(data)=>{
        data.map(async(item)=>{
          const time = new Date(item.time)
          if(time.getTime() + 14400000  < timeNow.getTime()){
             await ShowTime.findByIdAndUpdate(item._id,{
                $set :{
                  status: true
                }
              })
            await Ticket.updateMany(
              {"time" : item._id },
              {
                $set:{
                  status: true
                }
              }
              )
          }
        })
      });
      const times = await ShowTime.find({
        moive: { $in: req.params.moiveId },
      }).lean();
      console.log("time:", times);
      let arrayTime = [];
      let arayTimeDate = [];

       times.map((item, index, times) => {
        const time = new Date(item.time);
        let query = `${time.getDate()}-${time.getMonth()}-${time.getFullYear()}`;
        console.log("query", query);
        if (!arrayTime.includes(query)) {
          const array = times.filter((item) => {
            const timeItem = new Date(item.time);
            let query1 = `${timeItem.getDate()}-${timeItem.getMonth()}-${timeItem.getFullYear()}`;
            if (query == query1) return true;
            else {
              return false;
            }
          });

          arayTimeDate.push({ date: query, array: array });
          arrayTime.push(query);
        }
      });

      //    console.log(arayTimeDate)
      res.status(200).json({ times, arayTimeDate });
    } catch (err) {
      res.status(401).json(err);
    }
  },
  getShowTimeId : async(req,res)=>{
    try {
      const id = req.params.showtimeId
      console.log(id)
     const showTime=  await ShowTime.findById(id).lean().then(async(data)=>{
      return {
         moive: await Moive.findById(data.moive).lean(),
         room : await Room.findById(data.room).lean(),
         ticket: await Ticket.find({time :{$in: id} }).lean().then( async(data)=>{
            return await Bluebird.map((data), async(item)=>{
              const  bill = await Bill.findOne({ticket: item._id}).lean()   
              return {
                 ...item,
                payment: bill.payment,
                price: bill.price,
                bill: bill,
                discount: await Discount.findById(bill.discount).lean(),
                combo : await DetailCombo.find({bill: bill._id}).lean().then(async(detail)=>{
                  console.log("detail", detail)
                  const combos=  await Bluebird.map(detail, (async(item1)=>{
                      const combo = await Combo.findById(item1.combo).lean()
                      return{
                        value: item1.quantity,
                        id: combo._id,
                        name: combo.name
                      }
                      
                   }) ,{concurrency: detail.length})
                   return combos
      
                  
                })

                
        
              }
        
             },{ concurrency: data.length})   
         }),
         showTime : data,
       
      }
     })
      
      
      res.status(200).json(showTime);

    } catch (error) {
      res.status(403).json(error);
    }
  }

  
};

module.exports = showTimeController;
