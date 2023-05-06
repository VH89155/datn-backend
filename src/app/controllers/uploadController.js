

const uploadController ={
    upload: async(req, res) =>{
        if (!req.file) {
            console.log("upload file error")
           
        }       
          console.log(req.file.path)
          res.status(200).json({ secure_url: req.file.path })
    }

}

module.exports = uploadController;