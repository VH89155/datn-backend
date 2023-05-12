const User = require("../models/User");



const userController ={

    getAllUsers: async(req,res)=>{
        try {

         const users = await User.find().lean()
         
         res.status(200).json(users)
         

        } catch (error) {
                res.status(401).json({error})
        }
    }



}


module.exports = userController;