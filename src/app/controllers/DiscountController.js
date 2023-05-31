
const Discount = require('../models/Discount')
const Ticket = require('../models/Ticket')

const discountController ={
    addDiscount : async(req,res)=>{
        try {
            console.log(req.body)
            const discount =  new Discount({
                name: req.body.name,     
                description: req.body.description,
                discount_value: req.body.discount_value,
                start_time: req.body.start_time,
                end_time: req.body.end_time,
                only_one: req.body.only_one,
                quantity: req.body.quantity,
                minimum_price: req.body.minimum_price,
                minimum_quantity: req.body.minimum_quantity,
                
            }) 
            discount.save()
            // console.log(newCombo)
            res.status(200).json({success: true})
        } catch (error) {
            res.status(401).json({message: error})
        }
    },
    getDiscountID: async(req, res)=>{
        try {
            const timeNow = new Date()
            const {number, userID,total, nameDiscount} = req.body
            const data = await Discount.findOne({name:nameDiscount}).lean()
            console.log(data) 
            if(!data) return res.status(200).json({success: false,message:"Mã nhập vào không đúng !"})
            const  timeStart = new Date(data.start_time)    
            const  timeEnd = new Date(data.end_time)    
            if(data.only_one) {
                const ticket = await Ticket({discount:nameDiscount,user:userID}).lean()
                if(ticket) return res.status(200).json({success: false,message:"Mã này đã được bạn sử dùng !"})
            }
            if(timeNow.getTime() <timeStart.getTime() || timeNow.getTime() >timeEnd.getTime() ){
                return res.status(200).json({success: false,message:"Mã giảm giá không trong thời gian được sử dụng !"})
            }
            if(number.lenght < data.quantity_number )
            return res.status(200).json({success: false,message:"Mã giảm giá không trong thời gian được sử dụng !"})
            if(data.minimum_price > total){
                return res.status(200).json({success: false,message:"Số tiền vé chưa đạt mức tối thiểu để sự dụng !"})
            }
            if(data.minimum_quantity > number.lenght){
                return res.status(200).json({success: false,message:"Số ghế bạn đặt  chưa đạt mức tối thiểu để sự dụng !"})
            }
            if(data.quantity <1){
                return res.status(200).json({success: false,message:"Mã đã hết lượt sử dụng !"})
            }
            return res.status(200).json({success: true, ...data })

        } catch (error) {
            res.status(401).json({message: error})
            
        }
    },

    getDiscountIDAdmin: async(req, res)=>{
        try {
            const data = await Discount.findById(req.params.id).lean()
            
            res.status(200).json({success: "success", discounts:data})
        } catch (error) {
            res.status(401).json({message: error})
            
        }
    },



    getAllDiscount: async(req, res)=>{
        try {
            const data = await Discount.find().lean()
            
            res.status(200).json({success: "success", discounts:data})
        } catch (error) {
            res.status(401).json({message: error})
            
        }
    },
    editdiscount: async(req, res)=>{
        try {
            
            console.log(req.body.id)
            const discount = await Discount.findById(req.body.id).lean()
            console.log(req.body)
            // console.log(discount)
            if(!discount)  res.status(401).json({message: error})
             await Discount.findByIdAndUpdate(req.body.id, {$set:{
                name: req.body.name,     
                description: req.body.description,
                discount_value: req.body.discount_value,
                start_time: req.body.start_time,
                end_time: req.body.end_time,
                only_one: req.body.only_one,
                quantity: req.body.quantity,
                minimum_price: req.body.minimum_price,
                minimum_quantity: req.body.minimum_quantity,
                quantity: req.body.quantity,
            }}) 
            res.status(200).json({success: true})
        } catch (error) {
            res.status(401).json({message: error})
            
        }
    },
    deleteDiscount: async(req,res)=>{
        try {
            
            console.log(req.params.id)
            const discount = await Discount.findById(req.params.id).lean()
            console.log(discount)
            if(!discount)  res.status(401).json({message: error})
           await  Discount.delete({_id: {$in:req.params.id}})
            res.status(200).json({success: true})
        } catch (error) {
            res.status(401).json({message: error})
            
        }
    }
}


module.exports = discountController;