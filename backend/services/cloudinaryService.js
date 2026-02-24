import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**

 * @param {Buffer} buffer - 
 * @param {string} mimetype - 
 * @returns {Promise<{ url: string }>}
 */
export async function uploadToCloudinary(buffer, mimetype) {
  const isPdf = mimetype === "application/pdf";
  const dataUri = `data:${mimetype};base64,${buffer.toString("base64")}`;

  const result = await cloudinary.uploader.upload(dataUri, {
    folder: "barbearia",
    resource_type: isPdf ? "raw" : "image",
  });

  if (!result?.secure_url) throw new Error("Upload failed");
  return { url: result.secure_url };
}
