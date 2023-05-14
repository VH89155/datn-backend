const mongoose = require('mongoose');
const Schema= mongoose.Schema;
var mongooseDelete = require('mongoose-delete');

const NewSchema = new Schema({    
    name:{
        type:String,
        require:true,
    },
    time:{
        type:Date,
        default:Date.now()
    },
    image:{
        type:String,
        require: true,
    },

    data:{
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

NewSchema.plugin(mongooseDelete,{
    overrideMethods: 'all',
    deletedAt: true,
})

module.exports = mongoose.model('New', NewSchema);