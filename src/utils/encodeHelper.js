import bcrypt from "bcryptjs";
import config from "../config/config.js";

export const encodeFunction = (plaintext) => {
  let salt = bcrypt.genSaltSync(config.salt);
  let encryptedText = bcrypt.hashSync(plaintext, salt);
  return encryptedText;
};

export const decodeFunction = (plaintext, encryptedText) => {
  return bcrypt.compareSync(plaintext, encryptedText);
};
