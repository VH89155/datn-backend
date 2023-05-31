const mongoose = require('mongoose');
const Schema= mongoose.Schema;
var mongooseDelete = require('mongoose-delete');


const showTimeSchema = new Schema({
    moive:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Moive',
        required:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        default: null
    },
    room:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Room',
        required:true
    },

    time:{
        type:Date,
        required:true,
    },
    status:{
        type:Boolean,
        default:false
    }     

},{timestamps:true});

showTimeSchema.plugin(mongooseDelete,{
    overrideMethods: 'all',
    deletedAt: true,
})

module.exports = mongoose.model('ShowTime', showTimeSchema);