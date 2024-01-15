import multer from 'multer';


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '/public/temp');
    },
    filename: function (req,file,next){
      cb(null,file.originalname);
    }
  })
  
const upload = multer({ storage: storage })

export {upload};