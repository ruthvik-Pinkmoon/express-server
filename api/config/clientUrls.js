require("dotenv").config();

const CLIENT_URL = process.env.CLIENT_URL;
const ADMIN_URL = process.env.ADMIN_URL;
const LOCAL_ENV = process.env.LOCAL_ENV;

module.exports = {
  CLIENT_URL,
  ADMIN_URL,
  LOCAL_ENV,
};
