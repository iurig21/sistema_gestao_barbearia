import { upload } from "../services/uploadService.js";
import { uploadToCloudinary } from "../services/cloudinaryService.js";

const uploadController = {
  uploadFile: [
    upload.single("file"),
    async (req, res) => {
      try {
        if (!req.file) {
          return res.status(400).json({ message: "No file uploaded" });
        }

        const { url } = await uploadToCloudinary(
          req.file.buffer,
          req.file.mimetype
        );

        res.status(201).json({ url });
      } catch (err) {
        console.error("Upload error:", err);
        res.status(500).json({
          message: err.message || "Upload failed",
        });
      }
    },
  ],
};

export default uploadController;
