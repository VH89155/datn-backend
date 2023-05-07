const mongoose = require('mongoose');
const Schema= mongoose.Schema;
var mongooseDelete = require('mongoose-delete');


const TicketSchema = new Schema({
   
    time:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'ShowTime',
        required:true,
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    number:{
        type:[String],      
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
    combo:{
        type:[] ,
        default:null
        
    },
    status:{
        type:Boolean,
        default:false
    },
    cancel:{
        type:Boolean,
        default:false
    }
    


},{timestamps:true});

TicketSchema.plugin(mongooseDelete,{
    overrideMethods: 'all',
    deletedAt: true,
})

module.exports = mongoose.model('Ticket', TicketSchema);