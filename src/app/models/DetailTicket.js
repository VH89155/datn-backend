const mongoose = require('mongoose');
const Schema= mongoose.Schema;
var mongooseDelete = require('mongoose-delete');


const DetailTicketSchema = new Schema({
   
    ticket:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Ticket',
        required:true,
    },
    name:{
        type: String,
        required:true,
    },
    priceTicket:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'PriceTicket',
        required:true,
    },    
    price:{
        type:Number,
        required:true
    },
  
    status:{
        type:Boolean,
        default:false
    },
   
    // vote:{
       
    //         type:Boolean,
    //         default:false
        
    // }


    


},{timestamps:true});

DetailTicketSchema.plugin(mongooseDelete,{
    overrideMethods: 'all',
    deletedAt: true,
})

module.exports = mongoose.model('DetailTicket', DetailTicketSchema);





