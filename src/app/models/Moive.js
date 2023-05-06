

const moogoose = require('mongoose');
const Schema= moogoose.Schema;
var mongooseDelete = require('mongoose-delete');

const movieSchema = new Schema({
    name:{
        type:String,
        required:true,
    },
    // ngay khoi chieu
    premiere_date:{
        type: Date,
        required:true,

    },
    // thoi luong
    time:{
        type: Number,
        required:true,

    },
    // dao dien
    director:{
        type: String,
        required:true,

    },
    // dien vien
    performer:{
        type: [String],
        required:true,

    },

    // tuoi duoc xem

    age: {
        type: String,
        required:true,
        min:0,
    },
    images:{
        type:[String],
        default:[]

    },
    trailer: {
        type: String,
        required:true,
    },
    rating:{
        type: Number,
        default: 10,

    },

    // xuat xu
    origin:{
        type: String,
        required:true,
    },
    category:{
        type:[String],
        default:[]
    },
     description:{
        type: String,
     }
    


},{timestamps:true});

movieSchema.plugin(mongooseDelete,{
    overrideMethods: 'all',
    deletedAt: true,
})

module.exports = moogoose.model('Moive', movieSchema);