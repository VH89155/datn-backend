
const PriceTicket = require("../models/PriceTicket")


const priceTicketController ={
    addPriceTicket : async(req,res)=>{
        try {
            console.log(req.body)
            const priceTicket =  new PriceTicket({
                name: req.body.name,               
                price_time: req.body.price_time,
              
            }) 
             await priceTicket.save()
            // console.log(newCombo)
            res.status(200).json({success: "success", priceTicket: priceTicket})
        } catch (error) {
            res.status(401).json({message: error})
        }
    },
    getAllPriceTicket: async(req, res)=>{
        try {
            const data = await PriceTicket.find().lean()
            console.log(data)
            res.status(200).json({success: "success", priceTicket:data})
        } catch (error) {
            res.status(401).json({message: error})
            
        }
    },
    // editCombo: async(req, res)=>{
    //     try {
    //         const {_id, images, price, description  } =  req.body
    //         const combo = await Combo.findById(_id).lean()
    //         if(!combo)  res.status(401).json({message: error})
    //          await Combo.findByIdAndUpdate(_id, {$set:{
    //             images, price, description
    //         }}) 
    //         res.status(200).json({success: "success", combo:combo})
    //     } catch (error) {
    //         res.status(401).json({message: error})
            
    //     }
    // },
    // deleteCombo: async(req,res)=>{
    //     try {
    //         const _id  =  req.params.id
    //         const combo = await Combo.findById(_id).lean()
    //         if(!combo)  res.status(401).json({message: error})
    //        await  Combo.delete({_id : {$in:{_id}}})
    //         res.status(200).json({success: "success"})
    //     } catch (error) {
    //         res.status(401).json({message: error})
            
    //     }
    // }
}


module.exports = priceTicketController;