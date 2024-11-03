const crypto = require("crypto");
const algorithm = "aes-256-cbc";
const key = process.env.SECRET_KEY;
const iv = crypto.randomBytes(16);

// Function to encrypt data
function encrypt(text) {
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
  let encrypted = cipher.update(text, "utf-8", "hex");
  encrypted += cipher.final("hex");
  return `${iv.toString("hex")}:${encrypted}`;
}

// Function to decrypt data
function decrypt(text) {
  const [ivString, encryptedText] = text.split(":");
  const decipher = crypto.createDecipheriv(
    algorithm,
    Buffer.from(key),
    Buffer.from(ivString, "hex")
  );
  let decrypted = decipher.update(encryptedText, "hex", "utf-8");
  decrypted += decipher.final("utf-8");
  return decrypted;
}

module.exports = { decrypt, encrypt };
