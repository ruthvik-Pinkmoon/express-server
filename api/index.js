require("dotenv").config();
const express = require("express");
const mongoose = require('mongoose');
const cors = require("cors");
const notificationrouter = require("./routes/notificationsRoute");
const newsRoute = require("./routes/newsRoutes");
const eventRoute = require("./routes/eventsRoute");
const voiceRoute = require("./routes/voiceRoute");

const app = express();
app.use(cors());

mongoose.connect(process.env.MONGO_DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected successfully!'))
.catch(err => console.error('MongoDB connection error:', err));

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.use("/api/login", require("./routes/auth/login"));
app.use("/api/upload", require("./routes/formUpload/upload"));
app.use("/api/get-documents", require("./routes/formUpload/getDocuments"));
app.use("/api/notifications",notificationrouter)
app.use("/api/news",newsRoute)
app.use("/api/event",eventRoute)
app.use("/api/voices-at-aknu",voiceRoute)



module.exports = app;
