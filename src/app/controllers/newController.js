
const New = require('../models/New')


const newController ={
    addNew : async(req,res)=>{
        try {
            console.log(req.body)
            const news =  new New({
                name: req.body.name,
                image: req.body.image,
                time: req.body.time,
                data: req.body.data
            }) 
             news.save()
            // console.log(newnew)
            res.status(200).json({success: "success", new: news})
        } catch (error) {
            res.status(401).json({message: error})
        }
    },
    getAllnew: async(req, res)=>{
        try {
            const data = await New.find().lean()
            console.log(data)
        return  res.status(200).json({success: "success", new:data})
        } catch (error) {
            res.status(401).json({message: error})
            
        }
    },
    editNew : async(req,res)=>{
        try {

            const {id,name,data,image}= {...req.body}
            const news = await New.findById(id).lean()
            if(!news)  res.status(401).json({message: error})
             await New.findByIdAndUpdate( id,{
                $set:{
                    name, data,image
                }
             })
          
            // console.log(newnew)
            res.status(200).json({success: "success", new: news})
        } catch (error) {
            res.status(401).json({message: error})
        }
    },
    delteNew: async (req, res) => {
        try {
          const deleted = await New.delete({ _id:{$in: req.params.id}})
          if(deleted) return res.status(200).json({success: "success"})  

            
          return res.status(401).json(error);

         
        } catch (error) {
          console.log(error);
         return res.status(401).json(error);
        }
      },
      getNewID: async (req, res) => {
        try {
          const news = await New.findById(req.params.id);
          if(news) return res.status(200).json({success: "success",news})  

            
          return res.status(401).json(error);

         
        } catch (error) {
          console.log(error);
         return res.status(401).json(error);
        }
      },

}


module.exports = newController;