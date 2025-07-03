const cors = require("cors");
const { ADMIN_URL, LOCAL_ENV, CLIENT_URL } = require("../config/clientUrls");

const allowedOrigins = [
  CLIENT_URL,
  ADMIN_URL,
  LOCAL_ENV,
  "http://localhost:5173",
  "http://localhost:5174",
];

// const corsMiddleware = cors({
//   origin: function (origin, callback) {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
//   credentials: true,
// });

// const corsMiddleware = cors({
//   origin: true,
//   credentials: true,
// });

const corsMiddleware = cors({
  origin: allowedOrigins,
  // credentials: true,
});

module.exports = corsMiddleware;
