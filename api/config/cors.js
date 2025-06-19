require("dotenv").config();

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [];

module.exports = allowedOrigins;
