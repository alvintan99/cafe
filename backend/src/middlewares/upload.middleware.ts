import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
    },
});

export const upload = multer({
    storage,
    limits: {
        fileSize: 2 * 1024 * 1024, // 2MB
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png/;
        const mimeType = allowedTypes.test(file.mimetype);
        const extName = allowedTypes.test(
            path.extname(file.originalname).toLowerCase()
        );

        if (mimeType && extName) {
            cb(null, true);
        } else {
            cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    },
});
