const mongoose = require('mongoose');
const Schema= mongoose.Schema;
var mongooseDelete = require('mongoose-delete');

const DiscountSchema = new Schema({    
    name:{
        type:String,
        require:true,
        unique:true,
    },
   
    discount_value:{
        type:String,
        require:true,
    },
    start_time:{
        type:Date,
        default:Date.now()
    },
    end_time:{
        type:Date,
        default:Date.now()
    },
    description:{
        type: String,
        default:"",
     },
    only_once:{
        type: Boolean,
        default:false
     },
    quantity:{
        type:Number,
        default:null,
        require: true,
     },
    status:{
        type:Boolean,
        default:false
    },
    minimum_price:{
        type:Number,
        default:null,
    },
    minimum_quantity: {
        type:Number,
        default: null,
    }, 
    cancel:{
        type:Boolean,
        default:false
    }
    


},{timestamps:true});

DiscountSchema.plugin(mongooseDelete,{
    overrideMethods: 'all',
    deletedAt: true,
})

module.exports = mongoose.model('Discount', DiscountSchema);