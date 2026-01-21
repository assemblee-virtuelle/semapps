// Read all .env* files in the root folder and add them to process.env
// See https://github.com/kerimdzhanov/dotenv-flow for more details
import { config } from 'dotenv-flow';

config();

export const HOME_URL = process.env.SEMAPPS_HOME_URL;
export const SPARQL_ENDPOINT = process.env.SEMAPPS_SPARQL_ENDPOINT;
export const MAIN_DATASET = process.env.SEMAPPS_MAIN_DATASET;
export const SETTINGS_DATASET = process.env.SEMAPPS_SETTINGS_DATASET;
export const JENA_USER = process.env.SEMAPPS_JENA_USER;
export const JENA_PASSWORD = process.env.SEMAPPS_JENA_PASSWORD;
export const ACTIVATE_CACHE = process.env.SEMAPPS_ACTIVATE_CACHE === 'true';
export const FUSEKI_BASE = process.env.FUSEKI_BASE;

export const NG_ADMIN_USER_KEY = process.env.NG_ADMIN_USER_KEY;
export const NG_CLIENT_PEER_KEY = process.env.NG_CLIENT_PEER_KEY;
export const NG_PEER_ID = process.env.NG_PEER_ID;
export const NG_MAPPINGS_NURI = process.env.NG_MAPPINGS_NURI;
export const NG_MAPPINGS_USER_ID = process.env.NG_MAPPINGS_USER_ID;
