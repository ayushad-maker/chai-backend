import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    const result = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto"
    });

    // Delete local file after upload
    fs.unlink(localFilePath, (err) => {
      if (err) console.error("Error deleting temp file:", err);
      else console.log("Temp file deleted");
    });

    return result;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return null;
  }
};

export { uploadOnCloudinary };
