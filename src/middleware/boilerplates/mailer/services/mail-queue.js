const { JsonLdStorageMixin } = require('@semapps/ldp');

const MailQueueService = {
  name: 'mail-queue',
  mixins: [JsonLdStorageMixin],
  adapter: null, // To be set by the user
  collection: 'mails',
  settings: {
    containerUri: null, // To be set by the user
    context: {
      '@vocab': 'http://www.semapps.org/ontology#'
    }
  }
};

module.exports = MailQueueService;
