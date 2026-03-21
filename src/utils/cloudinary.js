import { v2 as cloudinary } from "cloudinary";
import config from "../config/config";

cloudinary.config({
  cloud_name: config.cloudinary.cloud_name,
  api_key: config.cloudinary.cloud_key,
  api_secret: config.cloudinary.cloud_secret,
});

export default cloudinary;
