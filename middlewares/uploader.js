const multer = require("multer");
const path = require("path");
require("dotenv").config();

// Configure Multer for Local File Storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

const UploadFile = () => {
  return (req, res, next) => {
    upload.fields([
      { name: "profile_picture", maxCount: 1 },
      { name: "certificate", maxCount: 1 },
    ])(req, res, (err) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }

      try {
        // Ensure profile picture is required
        if (!req.files || !req.files.profile_picture) {
          return res.status(400).json({ error: "Profile picture is required" });
        }

        // Store file paths in request body
        req.body.profile_picture = req.files.profile_picture[0].filename;
        req.body.certificate = req.files.certificate ? req.files.certificate[0].filename : null; // Optional

        next();
      } catch (error) {
        console.error("File Upload Error:", error);
        return res.status(500).json({ error: "Failed to upload file locally" });
      }
    });
  };
};

module.exports = { UploadFile };
