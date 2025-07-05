// middleware/multer.js
const multer = require("multer");
const storage = multer.memoryStorage(); // store in memory to convert to Buffer
const upload = multer({ storage });

module.exports = upload;
