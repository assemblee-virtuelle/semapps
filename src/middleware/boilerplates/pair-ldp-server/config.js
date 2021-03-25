// Read all .env* files in the root folder and add them to process.env
// See https://github.com/kerimdzhanov/dotenv-flow for more details
require('dotenv-flow').config();

module.exports = {
  HOME_URL: process.env.SEMAPPS_HOME_URL,
  SPARQL_ENDPOINT: process.env.SEMAPPS_SPARQL_ENDPOINT,
  MAIN_DATASET: process.env.SEMAPPS_MAIN_DATASET,
  JENA_USER: process.env.SEMAPPS_JENA_USER,
  JENA_PASSWORD: process.env.SEMAPPS_JENA_PASSWORD,
  REDIS_CACHE_URL: process.env.SEMAPPS_REDIS_CACHE_URL,
  OIDC_ISSUER: process.env.SEMAPPS_OIDC_ISSUER,
  OIDC_CLIENT_ID: process.env.SEMAPPS_OIDC_CLIENT_ID,
  OIDC_CLIENT_SECRET: process.env.SEMAPPS_OIDC_CLIENT_SECRET,
  BACKUP_SERVER_USER: process.env.SEMAPPS_BACKUP_SERVER_USER,
  BACKUP_SERVER_PASSWORD: process.env.SEMAPPS_BACKUP_SERVER_PASSWORD,
  BACKUP_SERVER_HOST: process.env.SEMAPPS_BACKUP_SERVER_HOST,
  BACKUP_SERVER_PATH: process.env.SEMAPPS_BACKUP_SERVER_PATH,
  BACKUP_FUSEKI_DATASETS_PATH: process.env.SEMAPPS_BACKUP_FUSEKI_DATASETS_PATH
};
