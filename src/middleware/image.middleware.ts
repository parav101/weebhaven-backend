import multer from 'multer';
import path from "path";
const storage = multer.diskStorage({
  destination:(req,file,cb)=>{
    cb(null,"images")
  },
  filename:(req,file,cb)=>{
    // console.log(file);
    cb(null,Date.now()+path.extname(file.originalname))
  }
})

export const upload = multer({storage:storage})