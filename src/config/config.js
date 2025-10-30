import dotenv from "dotenv";
dotenv.config();

const config = {
  salt: +process.env.SALT || 10,
  port: process.env.PORT || 4005,
  mongoOptions: {
    url: process.env.MONGODB_URL || "mongodb://127.0.0.1:27017/chatverse",
  },
  jwt: {
    secret: process.env.JWT_SECRET || "secret",
    expiresIn: process.env.EXPIRES_IN || "7d",
    refresh_secret: process.env.JWT_REFRESH_SECRET || "REFRESH-SECRET_KEY",
    refresh_expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "30d",
  },
};

export default config;
