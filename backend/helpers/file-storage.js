// modules
import multer from "multer";
import path from "path"

export const diskStorage = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null, 'public/img')
    },
    filename: (req, res, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})
