const ShowTime = require("../models/ShowTime");
const Moive = require("../models/Moive");
const Bluebird = require("bluebird");
const Room = require("../models/Room");
const Ticket = require("../models/Ticket");



const showTimeController = {
  getAllShowTime: async (req, res) => {
    try {
   const showTime = await ShowTime.find();
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
        const moiveRoom = await ShowTime.find({ room: { $in: roomId } }).lean();
        if (moiveRoom) {
          const array = await moiveRoom.filter((item) => {
            const timeItem = new Date(item.time);
            if (Math.abs(time.getTime() - timeItem.getTime()) < 14400000) {
              console.log("Loi Room");
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
            statusError = "Lỗi phòng chiếu hiện đang được sử dụng";
          }
        }
      }

      // const showTime = await ShowTime({
      //     moive: req.body.moive,
      //     time: req.body.time,
      //     room: req.body.room,
      // })
      // const newShowTime = await showTime.save();
      res.status(200).json({ statusError, statusSucsses });
    } catch (err) {
      console.log(err);
      res.status(401).json(err);
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
      
     const showTime=  await ShowTime.findById(id).lean().then(async(data)=>{
      return {
         moive: await Moive.findById(data.moive).lean(),
         room : await Room.findById(data.room).lean(),
         ticket: await Ticket.find({time :{$in: id} }).lean(),
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
