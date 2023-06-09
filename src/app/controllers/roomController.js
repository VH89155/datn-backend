
const Room = require('../models/Room');
const ShowTime = require('../models/ShowTime');
const RoomID_ShowTime = async(roomID,data) =>{
    let timeNow = new Date();
    timeNow.setHours(0);
    timeNow.setMinutes(0);
    timeNow.setSeconds(0);
    console.log(timeNow);
  
    const times = await ShowTime.find({ room: { $in: roomID } }).lean();
    let arrayTime = [];
    let arrayTimeDate = [];
  
    times.map(async (item, index, times) => {
      const time = new Date(item.time);
      let query = `${time.getDate()}-${
        time.getMonth() + 1
      }-${time.getFullYear()}`;
      //  console.log( "query",query)
  
      const array = times.filter((item) => {
        const timeItem = new Date(item.time);
        let query1 = `${timeItem.getDate()}-${
          timeItem.getMonth() + 1
        }-${timeItem.getFullYear()}`;
        if (query === query1) {
          return true;
        } else {
          return false;
        }
      });
      arrayTime.push(query);
      if (!arrayTimeDate.find((item) => item.date === query)) {
        arrayTimeDate.push({ time: time, date: query, array: array });
      }
    });
    // Promise.all(arrayTime)
    // console.log(arrayTime, arrayTimeDate);
    arrayTimeDate.sort((a, b) => {
      if (a.time > b.time) return -1;
      if (a.time < b.time) return 1;
      return 0;
    });
  
   if(data ==="all") arrayTimeDate = arrayTimeDate.filter((item) => item.time > timeNow);
    
    else{
      arrayTimeDate.sort((a, b) => {
        if (a.time > b.time) return -1;
        if (a.time < b.time) return 1;
        return 0;
      });
    }
    return arrayTimeDate;
}

const roomController={
    getAllRoom: async (req,res)=>{
        try{
        const room = await Room.find();
        console.log(room);
        res.status(200).json({room});
        }
        catch (err) {
            res.status(401).json(err);
          }
        

    },
    getAllShowTime_Room: async (req,res)=>{
        try{
          
            const room = req.query.room;
            console.log(room);
            const ShowTimeRoom = await RoomID_ShowTime(room);
            res.status(200).json({success:true, showTime: ShowTimeRoom});
        }
        catch (error) {
            res.status(401).json({message: error})
        }
       
    },
    addRoom: async (req,res)=>{
        try {
            console.log(req.body)
            const IsRoom = await Room.findOne({name:req.body.name}).lean();
            console.log(IsRoom)
            if(IsRoom) return res.status(200).json({success: false,message:"Tên phòng chiếu đã tồn tại"})
            const room =  new Room({
                name: req.body.name,
                category: req.body.category,
                
            }) 
            room.save()
            // console.log(newCombo)
            res.status(200).json({success: true, room: room})
        } catch (error) {
            res.status(401).json({message: error})
        }

    },
    editRoom: async(req, res)=>{
        try {
            const {_id, name,category,status  } =  req.body
            const room = await Room.findById(_id).lean()
            if(!room)  res.status(401).json({message: error})
             await Room.findByIdAndUpdate(_id, {$set:{
                name: name,
                category: category,
                status: status
            }}) 
            res.status(200).json({success: true, room: room})
        } catch (error) {
            res.status(401).json({message: error})
            
        }
    },
   
    
}

module.exports = roomController;