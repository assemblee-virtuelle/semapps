// Read all .env* files in the root folder and add them to process.env
// See https://github.com/kerimdzhanov/dotenv-flow for more details
require('dotenv-flow').config();

module.exports = {
  HOME_URL: process.env.SEMAPPS_HOME_URL,
  MONGODB_URL: process.env.SEMAPPS_MONGODB_URL,
  SMTP_HOST: process.env.SEMAPPS_SMTP_HOST,
  SMTP_USER: process.env.SEMAPPS_SMTP_USER,
  SMTP_PASS: process.env.SEMAPPS_SMTP_PASS
};
