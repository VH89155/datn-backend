const mongoose = require("mongoose");
const User = require("../models/User");
const JWT = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const Token = require("../models/Token");
const sendEmail = require("../../config/email/sendEmail");

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
  
  
  authGoogle : async(req,res)=>{
    const token = encodeToken(req.user._id)
    res.setHeader('Authorization',token)
    return res.status(200).json({ success: true, token: token, info: req.user });
  },
  authFacebook: async(req,res)=>{
    // const token = encodeToken(req.user._id)
    // res.setHeader('Authorization',token)
    // return res.status(200).json({ success: true, token: token, info: req.user });

    console.log(req.user)
  },
  authGoogle_New : async(req,res)=>{
    try{
      const checkUser = await User.findOne({
        email:req.body.email,
        authType: "loacal",
      })
      if(checkUser)
        return res.status(200).json({ success: false,message:"Bạn đã dùng email này để đăng kí tài khoản khác, hãy kiểm tra lại nhé!" });      
      const user = await User.findOne({
        authGoogleID: req.body.sub,
        email:req.body.email,
        authType: "google", })
    if(!user) {
      console.log(user)
      const newUser = new User({
        authType:'google',
        email: req.body.email,
        authGoogleID:req.body.sub,
        fullName:req.body.fullName,
        avatar: req.body.image,
        username:req.body.fullName
    })
       await newUser.save()
       const token = encodeToken(newUser._id)
        res.setHeader('Authorization',token)
        return res.status(200).json({ success: true, token: token, info: newUser });
    }
  
    const token = encodeToken(user._id)
    res.setHeader('Authorization',token)
    return res.status(200).json({ success: true, token: token, info: user });
    }
    catch(err){
      console.log(err)
      res.status(403).json({ message: err });
    }
    


  },


  signUp: async (req, res) => {
    console.log("data:", req.body);
    try {
      const { username, email, password } = req.body;
      const foundUser = await User.findOne({ email });
      // console.log(foundUser);
      if (foundUser)
        return res
          .status(403)
          .json({ error: { message: "Email is already in use" } });
      const foundUserName = await User.findOne({ username });
      // console.log(foundUser);
      if (foundUserName)
        return res
          .status(403)
          .json({ error: { message: "UserName is already in use" } });

      const newUser = new User({
        username: username,
        email: email,
        password: password,
      });
      console.log("new User", newUser);
      await newUser.save((err, user) => {
        if (err) {
          console.log("error", err);
        } else {
          console.log("success", user);
          const token = encodeToken(user._id);
          res.setHeader("Authorization", token);
          return res.status(201).json({ success: true, user: user });
        }
      });
    } catch (err) {
      res.status(403).json({ message: err });
    }
  },

  ////////
  signIn: async (req, res) => {
    console.log("signIn", req);
    try {
      if (req.user) {
        const token = encodeToken(req.user._id); // user nay duoc nhan tu ben passport o ham done
        res.setHeader("Authorization", token);
        console.log(req.user);
        return res
          .status(200)
          .json({ success: true, token: token, info: req.user });
      } else {
        return res.status(200).json({ success: false });
      }
    } catch (error) {
      res.status(403).json({ message: err });
    }
  },
  secret: async (req, res, next) => {
    const users = await User.findById(req.user._id);
    //    console.log(users);

    return res.status(200).json({ resourse: true, info: users });
  },
  logOut: async (req, res) => {
    try {
      res.clearCookie("Authorization");
      res.status(200).json("Logged out!");
    } catch (error) {
      res.status(403).json({ message: error });
    }
  },
  updateAvatar: async (req, res, next) => {
    // console.log(avatar);
    try {
      const { avatar, id } = req.body;
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
  updateUser: async (req, res) => {
    try {
      const { _id, phoneNumber, address, fullName } = req.body;
      const user = await User.findByIdAndUpdate(_id, {
        $set: { phoneNumber, address, fullName },
      });

      return res.status(200).json({ success: true, user });
    } catch (error) {
      console.log(error);
    }
  },

  /////// Forgot Password ----------------------------------
  sendEmailForgotPasword: async (req, res) => {
    try {
      console.log(req.body.email)
      const user = await User.findOne({ email: req.body.email });
      if (!user)
        return res.status(400).send("user with given email doesn't exist");

      let token = await Token.findOne({ userId: user._id });
      if (!token) {
        token = await new Token({
          userId: user._id,
          token: crypto.randomBytes(6).toString("hex"),
        }).save();
      }
      const link = token.token;
      await sendEmail(user.email, "Password reset", link);

      res
        .status(200)
        .json({
          status: "password reset link sent to your email account",
          token,
          success: true,
        });
    } catch (error) {
      res.status(400).json({ error });
    }
  },

  passwordNew: async(req, res) => {

    try{
      const user = await User.findOne({ email:req.body.email});
      if (!user) return res.status(400).send("invalid link or expired");

      const token = await Token.findOne({
          userId: user._id,
          token: req.body.token,
      });
      
      console.log(token);
      if (!token) return res.status(400).send("Invalid link or expired");
      const salt = await bcrypt.genSalt(10);
      const passwordHashed = await bcrypt.hash(req.body.password, salt);

      // user.password =  passwordHashed;
      await User.findByIdAndUpdate(user._id, {
          $set: { password: passwordHashed },
        });
      await token.delete();

     res.status(200).json({user, success: true});
    }
    catch (error) {
      res.status(400).json({ error });
    }

  },
  ressetPassword: async (req, res, next) => {
    try {
      const { _id, currentPass, newPass } = { ...req.body };
      const userFound = await User.findById(_id);
      if (!userFound || !userFound._id) {
        var err = new Error("User not exists!");
        err.status(404);
        return next(err);
      }
  
      const isCorrectPassword = await userFound.isValidPassword(currentPass);
      if (!isCorrectPassword) {
        var err = new Error("Current password is not correct!");
        err.status(404);
        return next(err);
      }
      console.log("ok");
      const salt = await bcrypt.genSalt(10);
      // generate a password hash (salt + hash)
      const passwordHashed = await bcrypt.hash(newPass, salt);
      console.log("passwordH :", passwordHashed);
      // console.log("new Pass: ", newPass)
      await User.findByIdAndUpdate(_id, {
        $set: { password: passwordHashed },
      });
      res.status(200).json({ success: true });
    } catch (err) {
      next(err);
    }
  }
};
module.exports = authController;
