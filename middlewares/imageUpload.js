import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, '../uploads');

// Set up multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // Use the upload directory
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); // Use the original file name
    },
});

// Initialize multer
const upload = multer({ storage });

export const uploadImage = upload.single('image'); // Export the middleware for image upload
