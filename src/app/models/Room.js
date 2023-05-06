const mongoose = require('mongoose');
const Schema= mongoose.Schema;
var mongooseDelete = require('mongoose-delete');


const roomSchema = new Schema({
    name:{
        type:String,       
        required:true
    },
    status:{
        type:Boolean,
        default:true,
    }     

},{timestamps:true});

roomSchema.plugin(mongooseDelete,{
    overrideMethods: 'all',
    deletedAt: true,
})

module.exports = mongoose.model('Room', roomSchema);