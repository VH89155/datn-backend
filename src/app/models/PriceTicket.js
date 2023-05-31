const mongoose = require('mongoose');
const Schema= mongoose.Schema;
var mongooseDelete = require('mongoose-delete');


const priceTicketSchema = new Schema({
    name:{
        type:String,       
        required:true
    },
    
    price_time:{
        type: [],

        required:true
    },
    status:{
        type:Boolean,
        default:true,
    },  
   

},{timestamps:true});

priceTicketSchema.plugin(mongooseDelete,{
    overrideMethods: 'all',
    deletedAt: true,
})

module.exports = mongoose.model('PriceTicket', priceTicketSchema);