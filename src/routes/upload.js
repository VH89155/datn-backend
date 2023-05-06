var express =require('express')
var router= express.Router();
const{ uploadCloud } = require('../config/cloudinary/cloudinary');
const uploadController =require('../app/controllers/uploadController')
router.post("/",uploadCloud.single('file') ,uploadController.upload);
module.exports = router;