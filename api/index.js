require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const notificationrouter = require("./routes/notificationsRoute");
const newsRoute = require("./routes/newsRoutes");
const eventRoute = require("./routes/eventsRoute");
const voiceRoute = require("./routes/voiceRoute");
const eventFormRouter = require("./routes/aknuform/eventForm");

const corsMiddleware = require("./middlewares/cors");
const certificateRoutes = require("./routes/aknuform/certificationRoute");

const alumniRoute = require("./routes/aknuform/alumniRoute");
const feedbackRoute = require("./routes/aknuform/feedbackRoute");
const addisomFormRouter = require("./routes/aknuform/admissionFormRouter");
const otprouter = require("./routes/chatwithus/otpRoute");
const chatrouter = require("./routes/chatwithus/chatWithUs");
const authenticationRouter = require("./routes/authentication/authenticationRoute");
const feesRouter = require("./routes/fees/feesFormRoute");
const admissionFeesRouter = require("./routes/fees/admissionFeesRoute");
const galleryRouter = require("./routes/galleryRoute");
const ResultBatch = require("./models/ResultBatch");
const resultsRouter = require("./routes/results");

const upload = multer({ storage: multer.memoryStorage() });

const app = express();
// app.use(cors());
app.use(corsMiddleware)

mongoose
  .connect(process.env.MONGO_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected successfully!"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use(express.json());

app.use("/api/login", require("./routes/auth/login"));
app.use("/api/upload", require("./routes/formUpload/upload"));
app.use("/api/get-documents", require("./routes/formUpload/getDocuments"));
app.use("/api/notifications", notificationrouter);
app.use("/api/news",newsRoute);
app.use("/api/event", eventRoute);
app.use("/api/voices-at-aknu", voiceRoute);
app.use("/api/upload", require("./routes/formUpload/upload"));
app.use("/api/get-documents", require("./routes/formUpload/getDocuments"));
app.use("/api/info", upload.any(), require("./routes/important_information"));

app.use("/api/info", upload.any(), require("./routes/important_information"));

app.use("/api/form-upload",eventFormRouter)
app.use("/api/admission-form", addisomFormRouter);
app.use("/api/certification-form", certificateRoutes);
app.use("/api/alumni-form",alumniRoute );
app.use("/api/feedback-form",feedbackRoute );
app.use("/api/otp",otprouter)
app.use("/api/chat-with-us",chatrouter)
app.use("/api/authentication", authenticationRouter);
app.use("/api/fees", feesRouter);
app.use("/api/carousel", require("./routes/carouselRoute"));
app.use("/api/important-dates", require("./routes/important_datesRoute"));
app.use("/api/admission-fees", admissionFeesRouter);
app.use("/api/gallery",galleryRouter);
app.use("/api/results",resultsRouter)

module.exports = app;
app.listen(3000)
