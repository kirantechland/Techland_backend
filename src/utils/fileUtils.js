import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Safely deletes a file from the server's public/uploads directory.
 * @param {string} relativePath - The path stored in the database (e.g., '/uploads/projects/abc.jpg')
 */
export const deleteFile = (relativePath) => {
    if (!relativePath || relativePath.startsWith("http")) return;

    try {
        // Convert current storage path (/uploads/...) to absolute disk path
        // Database path: /uploads/projects/xyz.jpg
        // Absolute path should be: backend/Techland_backend/public/uploads/projects/xyz.jpg

        // The relativePath starts with /uploads, so we just need to join it with public
        const absolutePath = path.join(__dirname, "../../public", relativePath);

        if (fs.existsSync(absolutePath)) {
            fs.unlinkSync(absolutePath);
            console.log(`🗑️ Deleted orphaned file: ${absolutePath}`);
        }
    } catch (error) {
        console.error(`❌ Error deleting file ${relativePath}:`, error.message);
    }
};
