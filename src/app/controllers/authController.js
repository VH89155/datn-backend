const mongoose = require("mongoose");
const User = require("../models/User");
const JWT = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const encodeToken = (userId) => {
  return JWT.sign(
    { 
      
      iss: "da",
      sub: userId, // sub 1 truong duy nhat phan biet cac user
      iat: new Date().getTime(),
      exp: new Date().setDate(new Date().getDate() + 7), // set thoi gian het han token
    },
    "secretKey"
  );
};

const authController = {


  signUp: async (req, res) => {
    console.log("data:" , req.body)
    try {
      const { username, email, password } = req.body;
      const foundUser = await User.findOne({ email });
  // console.log(foundUser);
     if (foundUser)
      return res.status(403)
      .json({ error: { message: "Email is already in use" } });
      const foundUserName = await User.findOne({ username });
  // console.log(foundUser);
    if (foundUserName)
    return res.status(403)
      .json({ error: { message: "UserName is already in use" } });
   
      const newUser = new User({
         username : username,
         email :email,
         password: password });
      console.log("new User", newUser);     
      await newUser.save((err, user) => {
        if(err){
          console.log("error", err)
        }
        else{
          console.log("success", user)
          const token =  encodeToken(user._id);
          res.setHeader("Authorization", token);
          return res.status(201).json({ success: true , user: user});
        }
       
      })
    
      
      
    } catch (err) {
      res.status(403).json({ message: err });
    }
  },

  ////////
  signIn: async (req, res)=>{
    try {
        const token = encodeToken(req.user._id); // user nay duoc nhan tu ben passport o ham done
        res.setHeader("Authorization", token);
        
        console.log(req.user);
        return res.status(200).json({ success: true, token: token, info: req.user });
    } catch (error) {
        res.status(403).json({ message: err });
    }
  },
   secret : async (req, res, next) => {
    const users = await User.findById(req.user._id);
    //    console.log(users);
  
    return res.status(200).json({ resourse: true,info:users });
  },
  logOut: async (req, res) => {
    try {

      res.clearCookie('Authorization');
      res.status(200).json("Logged out!");
    } catch (error) {
      res.status(403).json({ message: error });
    }
  },
  updateAvatar: async(req, res, next) => {
    // console.log(avatar);
    try {
      const {avatar, id} = req.body;
      console.log(avatar);
      const user = await User.findById(id).lean();
      if (!user || !user._id) {
        var err = new Error("User not exists!");
        res.status(404);
        return next(err);
      }
      if (avatar.trim().length < 1) {
        var err = new Error("Incorrect format !");
       
        res.status(404);
        
        return next(err);
      }
      const docUpdate = await User.findByIdAndUpdate(
       id,
        { avatar },
        { new: true }
      );
      
      return res.status(200).json({ success: true, docUpdate });
      
    } catch (error) {
        console.log(error);
    }

  },
  updateUser : async (req,res)=>{
    try {
      const {_id,phoneNumber,address,fullName} = req.body;
      const user = await User.findByIdAndUpdate(_id,{
        $set :{phoneNumber,address,fullName}
      })

      return res.status(200).json({ success: true, user });

    } catch (error) {
      console.log(error);
    }
  }

};
module.exports = authController;