const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    let folder = "notes_files";

    if (file.mimetype.startsWith("audio/")) {
      return {
        folder,
        resource_type: "raw", // Required for non-image/video files
        format: file.mimetype.split("/")[1], // Preserve original format
      };
    }

    return {
      folder,
      resource_type: "image", // Explicitly set for images
      allowed_formats: ["png", "jpeg", "jpg"], // Correct key name
    };
  },
});

module.exports = {
  cloudinary,
  storage,
};
