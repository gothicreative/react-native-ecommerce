import multer from 'multer';
import path from 'path';


const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },

});

const fileFilter = (req, file, cb) => {
    const allowedFileTypes = /jpeg|jpg|png|gif|webp/;
    const extName = allowedFileTypes.test(path.extname(file.originalname).toLocaleLowerCase());
    const mimeType = allowedFileTypes.test(file.mimetype);

    if (extName && mimeType) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type.'));
    }

};

export const upload = multer({ storage, fileFilter, limits: { fileSize: 1024 * 1024 * 5 } });
