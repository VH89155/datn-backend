
const Banner = require('../models/Banner');


const bannerController={
    getAllBanner: async (req,res)=>{
        try{
        const banner = await Banner.find();
        console.log(banner);
        res.status(200).json({banner});
        }
        catch (err) {
            res.status(401).json(err);
          }
        

    },

    addBanner: async (req,res)=>{
        try {
            console.log(req.body)
            
            const banner =  new Banner({
                banner: req.body.banner,
                qcRight: req.body.qcRight,
                qcLeft: req.body.qcLeft,
                qcTop: req.body.qcTop,
                
            }) 
            banner.save()
            // console.log(newCombo)
            res.status(200).json({success: true, banner: banner})
        } catch (error) {
            res.status(401).json({message: error})
        }

    },
    editBanner: async(req, res)=>{
        try {
            const {_id, } =  req.body
            const banner = await Banner.findById(_id).lean()
            if(!banner)  res.status(401).json({message: error})
           const bannerNew=    await Banner.findByIdAndUpdate(_id, {$set:{
              banner: req.body.banner,
              qcRight: req.body.qcRight,
              qcLeft: req.body.qcLeft,
              qcTop: req.body.qcTop,
            }}) 
            res.status(200).json({success: true, banner:bannerNew})
        } catch (error) {
            res.status(401).json({message: error})
            
        }
    },
   
    
}

module.exports = bannerController;