
const Room = require('../models/Room');


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