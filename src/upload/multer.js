import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
];

// Maximum file size: 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Configure Cloudinary
 */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * File filter to validate uploaded files
 */
const fileFilter = (req, file, cb) => {
  if (ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only JPEG, PNG, WebP, and GIF images are allowed."), false);
  }
};

/**
 * STORAGE CONFIGURATION
 * Switches between Local Disk and Cloudinary based on environment variables
 */
const getStorage = (dir) => {
  // Check if Cloudinary is configured
  const isCloudinaryConfigured = process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET;

  if (isCloudinaryConfigured) {
    console.log(`☁️ Cloudinary Storage active for ${dir}.`);
    return new CloudinaryStorage({
      cloudinary: cloudinary,
      params: {
        folder: `techland/${dir}`, // Folder name in Cloudinary
        allowed_formats: ["jpg", "jpeg", "png", "webp", "gif"],
        public_id: (req, file) => {
          // Generate a unique filename without extension
          const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          const name = path.parse(file.originalname).name;
          return `${name}-${uniqueSuffix}`;
        },
      },
    });
  }

  // DEFAULT: Local Disk Storage (Absolute Path)
  console.log(`📂 Local Disk Storage active for ${dir}.`);
  return multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = path.join(__dirname, "../../public/uploads", dir);
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
      cb(null, uniqueName);
    },
  });
};

/**
 * Multer configuration factory
 */
const createUploader = (dir) =>
  multer({
    storage: getStorage(dir),
    limits: {
      fileSize: MAX_FILE_SIZE,
      files: 1,
    },
    fileFilter: fileFilter,
  });

// Export configured uploaders
export const uploadTeamImage = createUploader("team");
export const uploadActivityImage = createUploader("activities");
export const uploadProjectImage = createUploader("projects");
export const uploadClientLogo = createUploader("clients");
export const uploadTestimonialImage = createUploader("testimonials");
