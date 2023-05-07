
const Combo = require('../models/Combo')


const comboController ={
    adddCombo : async(req,res)=>{
        try {
            console.log(req.body)
            const combo =  new Combo({
                name: req.body.name,
                images: req.body.images,
                price: req.body.price,
                description: req.body.description
            }) 
            const newCombo = await combo.save()
            // console.log(newCombo)
            res.status(200).json({success: "success", combo: newCombo})
        } catch (error) {
            res.status(401).json({message: error})
        }
    },
    getAllCombo: async(req, res)=>{
        try {
            const data = await Combo.find().lean()
            console.log(data)
            res.status(200).json({success: "success", combo:data})
        } catch (error) {
            res.status(401).json({message: error})
            
        }
    }
}


module.exports = comboController;