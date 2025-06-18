const crypto = require("crypto");

const ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_KEY, 'hex'); // Keep it secret
const IV_LENGTH = 16;

function encrypt(buffer) {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
    let encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
    return {
        iv: iv.toString('hex'),
        data: encrypted.toString('hex')
    };
}

const encryptFile = (req, res, next) => {
    if (!req.file) return next(); // No file to encrypt

    const encryptedFile = encrypt(req.file.buffer);

    req.encryptedFile = {
        data: encryptedFile.data,
        iv: encryptedFile.iv,
        contentType: req.file.mimetype
    };

    next();
};

module.exports = encryptFile;
