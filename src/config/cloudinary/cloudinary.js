
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_NAME,
//     api_key: process.env.CLOUDINARY_KEY,
//     api_secret:process.env.CLOUDINARY_SECRET
// });

cloudinary.config({
    cloud_name: "duytmd7ue",
    api_key: "943622875468682",
    api_secret: "fnKEK_bDDA6jP8noBwVSYWAbFho"
});


const storage = new CloudinaryStorage({
  cloudinary,
  folder:(req,res)=> "images",
  allowedFormats: ['jpg', 'png','mp4'],
  filename: function (req, file, cb) {
    cb(null, file.originalname); 
  }
});

const uploadCloud = multer({ storage });

module.exports = {uploadCloud,
cloudinary};

