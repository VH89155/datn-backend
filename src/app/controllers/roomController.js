
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
   
    
}

module.exports = roomController;