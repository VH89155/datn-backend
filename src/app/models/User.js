var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var mongooseDelete = require('mongoose-delete');
const bcrypt=require('bcryptjs');


var User= new Schema({
    username:{
        type:String,
        // required: true,
        unique:true,
        lowercase:true
    },
    email:{
        type:String,
        required: true,
        unique:true,
        lowercase:true
    },
    admin:{
        type:Boolean,
        default:false
    },
    fullName:{
        type:String,
        default:"Nguời dùng"
    },
    password:{
        type:String,
        
    },
    phoneNumber:{
        type:String,
        default:null,
    },
    address:{
        type:String,
        default:null,
    },
    authGoogleID:{
        type:String,
        default:null,
    }
    ,
    authType:{
        type:String,
        enum: ['local','google'],
        default:'local'
    },
    avatar:{
        type:String,
        default:'https://res.cloudinary.com/duong1310/image/upload/v1666660558/Home/avatar/default_enq4bq.jpg'
    }
},{timestamps:true})

User.pre('save',async function(next){
    try{
        if(this.authType !=='local') next()
        // generate a salt
        // console.log('password ', this.password);
        const salt= await bcrypt.genSalt(10);
        // generate a password hash (salt + hash)
        const passwordHashed=await bcrypt.hash(this.password,salt);
        // re-assign password hashed
        // console.log("passwordHashed ",passwordHashed);
        this.password=passwordHashed;
        next();
    }
    catch(error){
        next(error)
    }
})


User.methods.isValidPassword=async function(newPassword){
        try{

          return  await bcrypt.compare(newPassword,this.password); // true false
        }
        catch(error){
            throw new Error(error);
        }
}


User.plugin(mongooseDelete,{deteledAt:true ,overrideMethods: true}) //, overrideMethods: true
module.exports= mongoose.model('User',User);