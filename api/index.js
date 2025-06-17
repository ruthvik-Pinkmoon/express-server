require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.use("/api/login", require("./routes/auth/login"));
app.use("/api/upload", require("./routes/formUpload/upload"));
app.use("/api/get-documents", require("./routes/formUpload/getDocuments"));

module.exports = app;
