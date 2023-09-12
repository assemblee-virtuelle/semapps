const urlJoin = require('url-join');
const fetch = require('node-fetch');
const CONFIG = require('./config');

const clearDataset = async (dataset) => {
  return await fetch(urlJoin(CONFIG.SPARQL_ENDPOINT, dataset, 'update'), {
    method: 'POST',
    body: 'update=CLEAR+ALL',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(`${CONFIG.JENA_USER}:${CONFIG.JENA_PASSWORD}`).toString('base64')}`,
      'X-SemappsUser': 'system',
    },
  });
};

module.exports = {
  clearDataset,
};
