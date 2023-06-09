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
        default:"https://res.cloudinary.com/duytmd7ue/image/upload/v1683021038/6443fd2e624be_1682177326_djhdmr.png"
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