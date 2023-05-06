const passport =require('passport');
const localStrategy=require('passport-local').Strategy
const JwtStrategy=require('passport-jwt').Strategy
const {ExtractJwt} =require('passport-jwt')
const User =require('../models/User');
// giup ta co the nhan biet va ma hoa dc token gui len la cua server tao ra 
passport.use(new JwtStrategy(
{
    jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken('Authorization'),  // lay token de unlock
    secretOrKey:"secretKey"
},  
async(payload,done)=>{
    try{
        console.log('payload',payload);
        const user=await User.findById(payload.sub);
        if(!user) return done(null,false);
        done(null,user);
    }
    catch(error){
        done(error,false);
    }
}))

//passport local
passport.use(new localStrategy({
    usernameField:'email'    // bang  voi truong nhan tu body
}, async (email,password,done)=>{
    try{
        console.log('email',email)
        const user=await User.findOne({email});
        if(!user){
            return done(null,false);
        }
        //neu co thi so sanh password
        const isCorrectPassword=await user.isValidPassword(password);
        if(!isCorrectPassword) return done(null,false);
        done(null,user);  // assign  user
    }
    catch(error){
        done(error,false);
    }

}))