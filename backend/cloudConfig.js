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

    // Check if the file is an audio file
    if (file.mimetype.startsWith("audio/")) {
      return {
        folder,
        resource_type: "video", // Treat audio files as raw
        format: "wav",
      };
    }

    // Default for images
    return {
      folder,
      allowedFormats: ["png", "jpeg", "jpg"],
    };
  },
});

module.exports = {
  cloudinary,
  storage,
};
