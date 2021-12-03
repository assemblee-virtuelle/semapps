const path = require('path');
const { JsonLdService } = require('@semapps/jsonld');
const CONFIG = require('../config');

module.exports = {
  mixins: [JsonLdService],
  settings: {
    baseUri: CONFIG.HOME_URL,
    localContextFiles: [
      {
        path: '/context.json',
        file: path.resolve(__dirname, '../public/context.json')
      }
    ],
    remoteContextFiles: [
      {
        uri: 'https://www.w3.org/ns/activitystreams',
        file: path.resolve(__dirname, '../public/context-as.json')
      }
    ]
  }
};
