const mongoose = require('mongoose');
const Schema= mongoose.Schema;
var mongooseDelete = require('mongoose-delete');

const VoteSchema = new Schema({    
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    ticket:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Ticket',
        required:true,
    },
    moive:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Moive',
        required:true,
    },
    star:{
        type: Number,
        default:5
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

VoteSchema.plugin(mongooseDelete,{
    overrideMethods: 'all',
    deletedAt: true,
})

module.exports = mongoose.model('Vote', VoteSchema);