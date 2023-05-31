
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
    },
    getComboID: async(req, res)=>{
        try {
            const id = req.params.id
            const data = await Combo.findById(id).lean()
            console.log(data)
            res.status(200).json({success: "success", combo:data})
        } catch (error) {
            res.status(401).json({message: error})
            
        }
    },
    editCombo: async(req, res)=>{
        try {
            const {_id, images, price, description  } =  req.body
            const combo = await Combo.findById(_id).lean()
            if(!combo)  res.status(401).json({message: error})
             await Combo.findByIdAndUpdate(_id, {$set:{
                images, price, description
            }}) 
            res.status(200).json({success: "success", combo:combo})
        } catch (error) {
            res.status(401).json({message: error})
            
        }
    },
    deleteCombo: async(req,res)=>{
        try {
            const _id  =  req.params.id
            const combo = await Combo.findById(_id).lean()
            if(!combo)  res.status(401).json({message: error})
           await  Combo.delete({_id : {$in:{_id}}})
            res.status(200).json({success: "success"})
        } catch (error) {
            res.status(401).json({message: error})
            
        }
    }
}


module.exports = comboController;