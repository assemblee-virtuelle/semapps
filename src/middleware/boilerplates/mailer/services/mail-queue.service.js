const urlJoin = require('url-join');
const DbService = require('moleculer-db');
const { TripleStoreAdapter } = require('@semapps/ldp');
const CONFIG = require('../config');

const MailQueueService = {
  name: 'mail-queue',
  mixins: [DbService],
  adapter: new TripleStoreAdapter(),
  settings: {
    containerUri: urlJoin(CONFIG.HOME_URL, 'mails'),
    context: {
      '@vocab': 'http://semapps.org/ns/',
      ldp: 'http://www.w3.org/ns/ldp#'
    }
  }
};

module.exports = MailQueueService;
