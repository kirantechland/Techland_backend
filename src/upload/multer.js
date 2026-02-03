import multer from "multer";
import path from "path";

// Allowed image MIME types
const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
];

// Maximum file size: 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024;

/**
 * File filter to validate uploaded files
 * Only allows specific image types
 */
const fileFilter = (req, file, cb) => {
  if (ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Only JPEG, PNG, WebP, and GIF images are allowed."
      ),
      false
    );
  }
};

/**
 * Storage configuration factory
 * Creates storage config for different upload directories
 */
const storage = (dir) =>
  multer.diskStorage({
    destination: `public/uploads/${dir}`,
    filename: (req, file, cb) => {
      // Sanitize filename to prevent directory traversal attacks
      const sanitizedOriginalName = path
        .basename(file.originalname)
        .replace(/[^a-zA-Z0-9.-]/g, "_");

      // Generate unique filename with timestamp
      const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(sanitizedOriginalName)}`;
      cb(null, uniqueName);
    },
  });

/**
 * Multer configuration factory
 * Creates multer instance with security settings
 */
const createUploader = (dir) =>
  multer({
    storage: storage(dir),
    limits: {
      fileSize: MAX_FILE_SIZE,
      files: 1, // Only allow single file upload
    },
    fileFilter: fileFilter,
  });

// Export configured uploaders for different modules
export const uploadTeamImage = createUploader("team");
export const uploadActivityImage = createUploader("activities");
export const uploadProjectImage = createUploader("projects");
export const uploadClientLogo = createUploader("clients");

