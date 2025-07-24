import multer from "multer";
import path from "path";

// Define upload path - going up two levels from src/config to reach project root
const UPLOAD_PATH = path.join(__dirname, '..', '..', 'public');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_PATH);  // Files will be saved in storage/uploads
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    // Use the fieldname (pronunciation or examplePronunciation) in the filename
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Check if the field name is either pronunciation or examplePronunciation
  if (!['pronunciation', 'examplePronunciation'].includes(file.fieldname)) {
    return cb(new Error('Invalid field name for audio upload'));
  }

  
  // Accept MP3 files only
  if (!file.originalname.match(/\.(mp3)$/)) {
    return cb(new Error('Only MP3 files are allowed!'));
  }
  cb(null, true);
};

// Create upload middleware for both files
export const upload = multer({ 
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024  // 10MB limit
  }
});

// Export a fields configuration for multiple file uploads
export const audioFields = [
  { name: 'pronunciation', maxCount: 1 },
  { name: 'examplePronunciation', maxCount: 1 }
];