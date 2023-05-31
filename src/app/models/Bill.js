const mongoose = require('mongoose');
const Schema= mongoose.Schema;
var mongooseDelete = require('mongoose-delete');


const BillSchema = new Schema({
   
    ticket:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Ticket',
        required:true,
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },    
    price:{
        type:Number,
        required:true
    },
    payment:{
        type:String,
        required:true    
    },
    paymentId:{
        type:String,
        default:null,
    },
    // combo:{
    //     type:[mongoose.Schema.Types.ObjectId],
    //     ref:'Combo',
    //     default:null
        
    // },
    discount:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Discount',
        default:null
    },
    status:{
        type:Boolean,
        default:false
    },
    cancel:{
        type:Boolean,
        default:false
    },
    // vote:{
       
    //         type:Boolean,
    //         default:false
        
    // }


    


},{timestamps:true});

BillSchema.plugin(mongooseDelete,{
    overrideMethods: 'all',
    deletedAt: true,
})

module.exports = mongoose.model('Bill', BillSchema);





