const { JsonLdStorageMixin } = require('@semapps/ldp');
const MongoDbAdapter = require('moleculer-db-adapter-mongo');
const CONFIG = require('../config');

const MailQueueService = {
  name: 'mail-queue',
  mixins: [JsonLdStorageMixin],
  adapter: new MongoDbAdapter(CONFIG.MONGODB_URL),
  collection: 'mails',
  settings: {
    containerUri: CONFIG.HOME_URL + 'mails/',
    context: {
      '@vocab': 'http://www.semapps.org/ontology#'
    }
  }
};

module.exports = MailQueueService;
