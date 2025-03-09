import multer from "multer";
import fs from 'fs';
import path from 'path';
// Ensure directory exists
const ensureDirExists = (dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  };
  
  // Define dynamic storage function
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      let uploadFolder = "uploads/";
  
      if (req.route.path.includes("/update_profile")) {
        uploadFolder += "profiles/";
      } else if (req.route.path.includes("/upload_notice")) {
        uploadFolder += "notices/";
      }
  
      ensureDirExists(uploadFolder); // Ensure folder exists before saving
      cb(null, uploadFolder);
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    },
  });
  
  
  
  // Multer middleware with dynamic storage
  export const upload = multer({ storage });
  