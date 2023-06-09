const mongoose = require('mongoose');
const Schema= mongoose.Schema;
var mongooseDelete = require('mongoose-delete');

const BannerSchema = new Schema({    
    banner:{
        type:[String],
       default:["https://res.cloudinary.com/duytmd7ue/image/upload/v1686075057/980x448_88_wfgzqe.png","https://res.cloudinary.com/duytmd7ue/image/upload/v1686075054/980x448_2__20_trogi5.jpg","https://res.cloudinary.com/duytmd7ue/image/upload/v1686075054/980wx448h_34_dezmqx.jpg"],
    },
    qcRight:{
        type:String,
        default:null,
    },
    qcLeft:{
        type:String,
        default:null,
    },
    qcTop:{
        type:String,
        default:null,
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

BannerSchema.plugin(mongooseDelete,{
    overrideMethods: 'all',
    deletedAt: true,
})

module.exports = mongoose.model('Banner', BannerSchema);