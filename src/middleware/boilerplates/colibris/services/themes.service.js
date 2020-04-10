const urlJoin = require('url-join');
const DbService = require('moleculer-db');
const slugify = require('slugify');
const { TripleStoreAdapter } = require('@semapps/ldp');
const CONFIG = require('../config');

const ThemeService = {
  name: 'themes',
  mixins: [DbService],
  adapter: new TripleStoreAdapter(),
  settings: {
    containerUri: urlJoin(CONFIG.HOME_URL, 'themes'),
    context: {
      ldp: 'http://www.w3.org/ns/ldp#',
      pair: 'http://virtual-assembly.org/ontologies/pair#'
    },
    themes: [
      'Culture',
      'Social',
      'Agriculture',
      'Alimentation',
      'Démocratie',
      'Gouvernance',
      'Énergie',
      'Habitat',
      'Économie',
      'Éducation'
    ]
  },
  async started() {
    for (let themeLabel of this.settings.themes) {
      // TODO put in LDP service
      const slug = slugify(themeLabel, { lower: true });
      try {
        await this.actions.get({ id: urlJoin(this.settings.containerUri, slug) });
      } catch (e) {
        // If we get an error, it means the theme doesn't exist, so create it
        await this.actions.create({
          slug: slug,
          '@context': { pair: 'http://virtual-assembly.org/ontologies/pair#' },
          '@type': 'pair:Thema',
          'pair:preferedLabel': themeLabel
        });
      }
    }
  }
};

module.exports = ThemeService;
