const crypto = require("crypto");

const ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');
const IV_LENGTH = 16;

function decrypt(encrypted) {
    const iv = Buffer.from(encrypted.iv, 'hex');
    const encryptedText = Buffer.isBuffer(encrypted.data) ? encrypted.data : Buffer.from(encrypted.data.data);
    const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
    let decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]);
    return decrypted;
}

const decryptFile = (req, res, next) => {
    if (!req.fileData) return next(); // No file to decrypt

    const decryptedBuffer = decrypt({
        iv: req.fileData.iv,
        data: req.fileData.data
    });

    req.decryptedFileBuffer = decryptedBuffer;

    next();
};

module.exports = { decrypt, decryptFile }; // Export both!
