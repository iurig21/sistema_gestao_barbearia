import { upload } from "../services/uploadService.js";

const uploadController = {
  uploadFile: [
    upload.single("file"),
    async (req, res) => {
      try {
        if (!req.file) {
          return res.status(400).json({ message: "No file uploaded" });
        }

        res.status(201).json({ filename: req.file.filename });
      } catch (err) {
        console.error("Upload error:", err);
        res.status(500).json({ message: "Internal server error" });
      }
    },
  ],
};

export default uploadController;
