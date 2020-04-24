const urlJoin = require('url-join');
const DbService = require('moleculer-db');
const slugify = require('slugify');
const { TripleStoreAdapter } = require('@semapps/ldp');
const CONFIG = require('../config');

const StatusService = {
  name: 'status',
  mixins: [DbService],
  adapter: new TripleStoreAdapter(),
  settings: {
    containerUri: urlJoin(CONFIG.HOME_URL, 'status'),
    context: {
      ldp: 'http://www.w3.org/ns/ldp#',
      semapps: 'http://semapps.org/ns/'
    },
    values: ['En réflexion', 'En cours', 'En sommeil', 'Abandonné']
  },
  async started() {
    for (let value of this.settings.values) {
      // TODO put in LDP service
      const slug = slugify(value, { lower: true });
      try {
        await this.actions.get({ id: urlJoin(this.settings.containerUri, slug) });
      } catch (e) {
        // If we get an error, it means the status doesn't exist, so create it
        await this.actions.create({
          slug: slug,
          '@context': { '@vocab': 'http://semapps.org/ns/' },
          '@type': 'ProjectState',
          label: value
        });
      }
    }
  }
};

module.exports = StatusService;
