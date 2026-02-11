# Techland Backend API

## ☁️ Permanent Cloud Storage (AWS S3)

To ensure images never disappear (especially on AWS/Render/Heroku), I have prepared the backend for AWS S3 integration.

### Setup Instructions:
1. **Create S3 Bucket**: Create a bucket on AWS and set permissions to "Public" if you want direct URL access.
2. **Configure `.env`**: Add your credentials:
   ```env
   AWS_ACCESS_KEY_ID=your_key
   AWS_SECRET_ACCESS_KEY=your_secret
   AWS_REGION=your_region
   AWS_S3_BUCKET=your_bucket_name
   ```
3. **Install Packages**: Run this in the `backend/Techland_backend` folder:
   ```bash
   npm install @aws-sdk/client-s3 multer-s3
   ```

The system is designed to automatically detect these variables and switch from local storage to permanent Cloud storage.

## 🛠️ Features Fixed
- **Absolute Paths**: Fixed images disappearing when starting the server from different folders.
- **Auto-Cleanup**: When you delete a record (Team, Activity, Project, Client) in the Admin panel, the associated image file is now automatically deleted from the server to save space.
- **Robustness**: Added directory auto-creation for all upload folders.

## 🚀 Deployment
Use `npm run start` for production.
