const mongoose = require('mongoose');
const Schema= mongoose.Schema;
var mongooseDelete = require('mongoose-delete');


const DetailComboSchema = new Schema({
   
    combo:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Combo',
        required:true,
    },
    bill:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Bill',
        required:true,
    },    
    quantity:{
        type: Number,
        required:true,
    },
   
    // },
  
    status:{
        type:Boolean,
        default:false
    },
    cancel:{
        type:Boolean,
        default:false
    },
  

    


},{timestamps:true});

DetailComboSchema.plugin(mongooseDelete,{
    overrideMethods: 'all',
    deletedAt: true,
})

module.exports = mongoose.model('DetailCombo', DetailComboSchema);