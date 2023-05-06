const mongoose = require('mongoose');
const Schema= mongoose.Schema;
var mongooseDelete = require('mongoose-delete');

const ComboSchema = new Schema({    
    name:{
        type:String,
        require:true,
    },
    images:{
        type:String,
        require:true,
    },
    price:{
        type:Number,
        require:true
    },
    description:{
        type: String,
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

ComboSchema.plugin(mongooseDelete,{
    overrideMethods: 'all',
    deletedAt: true,
})

module.exports = mongoose.model('Combo', ComboSchema);