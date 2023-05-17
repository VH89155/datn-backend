
const Ticket = require('../models/Ticket')
const Vote = require('../models/Vote')


const voteController ={
    addVote : async(req,res)=>{
        try {
            console.log(req.body)
            const vote =  new Vote({
               user: req.body.user,
               ticket: req.body.ticket,
               moive:req.body.moive,
               description: req.body.description,

            }) 
             await vote.save().then(async()=>{
                await Ticket.findByIdAndUpdate(req.body.ticket,{
                    $set:{
                        vote : true,
                    }
                })
            })
            // console.log(newvote)
            res.status(200).json({success: true})
        } catch (error) {
            res.status(401).json({message: error})
        }
    },
    getAllvote: async(req, res)=>{
        try {
            const data = await Vote.find().lean()
            console.log(data)
            res.status(200).json({success: "success", vote:data})
        } catch (error) {
            res.status(401).json({message: error})
            
        }
    },
    getVote_Moive: async(req, res)=>{
        try {
            console.log(req.params.query)
            const moive = req.params.query
            const data = await Vote.findOne({moive:moive }).lean()
            console.log(data)
            res.status(200).json({success: "success", vote:data})
        } catch (error) {
            res.status(401).json({message: error})
            
        }
    },

    editvote: async(req, res)=>{
        try {
            const {_id, images, price, description  } =  req.body
            const vote = await vote.findById(_id).lean()
            if(!vote)  res.status(401).json({message: error})
             await vote.findByIdAndUpdate(_id, {$set:{
                images, price, description
            }}) 
            res.status(200).json({success: "success", vote:vote})
        } catch (error) {
            res.status(401).json({message: error})
            
        }
    },
    deletevote: async(req,res)=>{
        try {
            const _id  =  req.params.id
            const vote = await Vote.findById(_id).lean()
            if(!vote)  res.status(401).json({message: error})
           await  Vote.delete({_id : {$in:{_id}}})
            res.status(200).json({success: "success"})
        } catch (error) {
            res.status(401).json({message: error})
            
        }
    }
}


module.exports = voteController;