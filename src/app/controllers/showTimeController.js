const ShowTime = require("../models/ShowTime");
const Moive = require("../models/Moive");
const Bluebird = require("bluebird");
const Room = require("../models/Room");
const Ticket = require("../models/Ticket");
const Combo = require("../models/Combo");

let timeNow = new Date();


const showTimeController = {
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
            ).then((data) => (statusSucsses = data));
          
         
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
      const deleted = await ShowTime.delete({ _id:{$in: req.params.id}}).then(async()=>{
        const arrayTickets = await Ticket.find().lean()
        arrayTickets.map(async(item)=>{
         await Ticket.delete({ time: {$in:req.params.id }})
        })
     })
      
      res.status(200).json({success:true,status:"Deleted success !"});
     
    } catch (error) {
      console.log(error);
      res.status(401).json(error);
    }
  },

  getShowTimeMoiveId: async (req, res) => {
    console.log(req.body);
    try {
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

              return {
                 ...item,
                 combo: item.combo[0].id !== "" ? await Bluebird.map(item.combo, async(item)=>{
                  const combo = await Combo.findById(item.id).lean()
                  // console.log( "combo",combo)
                  return{
                    id : item.id,
                    name: combo.name,
                    value: item.value,
                  }
              }, { concurrency: item.combo.length})  : null,
        
              }
        
             },{ concurrency: data.length})   
         }),
         showTime : data

      }
     })
      
      
      res.status(200).json(showTime);

    } catch (error) {
      res.status(403).json(error);
    }
  }

  
};

module.exports = showTimeController;
