import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { config } from "dotenv";
config({ path: "../../.env" });
cloudinary.config({
  cloud_name: process.env.CLODUINARY_CLOUD_NAME || "dqlcy9wmd",
  api_key: process.env.CLODUINARY_API_KEY || 513937327371915,
  api_secret:process.env.CLODUINARY_API_SECRET || "9XnoWAmjQOP-XhuRbT1cIEm-99c",
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    fs.unlink(localFilePath);
    return null;
  }
};
export { uploadOnCloudinary };
