const passport =require('passport');
const localStrategy=require('passport-local').Strategy
const JwtStrategy=require('passport-jwt').Strategy
const {ExtractJwt} =require('passport-jwt')
const User =require('../models/User');
const GooglePlusTokenStrategy = require('passport-google-plus-token');
const FacebookTokenStrategy = require('passport-facebook-token');
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
    email :"email"  // bang  voi truong nhan tu body
}, async (email,password,done)=>{
    try{
        console.log('payload',payload)
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


passport.use(new GooglePlusTokenStrategy({
    clientID: "1050277056044-lnbv21ab2l007b6j4mr5pg17ikr1u2ul.apps.googleusercontent.com",
    clientSecret: "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",
    
}, async( accessToken, refreshToken, profile, done)=> {
    try{

        console.log('accessToken',accessToken)
        console.log('refreshToken',refreshToken);
        console.log('profile',profile)
        console.log("img",profile._json.image.url)
        console.log("fullName",profile._json.displayname)
        /// check whether this user is authenticated

        const user = await User.findOne({
            authGoogleID: profile.id,
            authType: "google", 
         })
        if(user) return done(null,user)
        const newUser = new User({
            authType:'google',
            email: profile.emails[0].value,
            authGoogleID:profile.id,
            fullName:profile._json.displayName,
            avatar: profile._json.image.url

        })

        await newUser.save()
        done(null,newUser)

    }
    catch(error) {
        done(error,false);
    }  
   
}));
passport.use(new FacebookTokenStrategy({
    clientID: "6102558226528128",
    clientSecret: "64de2a6146bf0c5200fda38130b55125",
    fbGraphVersion: 'v3.0'
  }, function(accessToken, refreshToken, profile, done) {
    try{

        console.log('accessToken',accessToken)
        console.log('refreshToken',refreshToken);
        console.log('profile',profile)
       

    }catch(err){
        done(err,false);
    } 
    
}));
  
