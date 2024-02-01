import crypto from "crypto";

const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

export function encrypt(text) {
  const algorithm = "aes-256-cbc";
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encryptedText = cipher.update(text, "utf8", "hex");
  encryptedText += cipher.final("hex");
  return encryptedText;
}

export function decyrpt(text) {
  const algorithm = "aes-256-cbc";
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decryptedText = decipher.update(text, "hex", "utf8");
  decryptedText += decipher.final("utf8");
  return decryptedText;
}
