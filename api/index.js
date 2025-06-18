require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer")

const upload = multer({ storage: multer.memoryStorage() });

const app = express();

app.use(cors({ origin: true, credentials: true, origin: "*" }));
app.use(express.json());

app.use("/api/login", require("./routes/auth/login"));
app.use("/api/upload", require("./routes/formUpload/upload"));
app.use("/api/get-documents", require("./routes/formUpload/getDocuments"));
app.use("/api/info", upload.any(), require("./routes/important_information"));
module.exports = app;
