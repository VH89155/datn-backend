const mongoose = require('mongoose');
const Schema= mongoose.Schema;
var mongooseDelete = require('mongoose-delete');


const showTimeSchema = new Schema({
    moive:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Moive',
        required:true
    },
    room:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Room',
        required:true
    },

    time:{
        type:Date,
        required:true,
    }     

},{timestamps:true});

showTimeSchema.plugin(mongooseDelete,{
    overrideMethods: 'all',
    deletedAt: true,
})

module.exports = mongoose.model('ShowTime', showTimeSchema);