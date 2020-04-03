const { TripleStoreAdapter, JsonLdStorageMixin } = require('@semapps/ldp');
const slugify = require('slugify');
const CONFIG = require('../config');

const ThemeService = {
  name: 'themes',
  mixins: [JsonLdStorageMixin],
  dependencies: ['ldp'],
  adapter: new TripleStoreAdapter(),
  collection: 'themes',
  settings: {
    containerUri: CONFIG.HOME_URL + 'themes/',
    context: { '@vocab': 'http://virtual-assembly.org/ontologies/pair#' },
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
    let theme = null;
    for (let themeLabel of this.settings.themes) {
      // TODO put in LDP service
      const slug = slugify(themeLabel, { lower: true });

      theme = await this.actions.get({ id: this.settings.containerUri + slug });

      if (theme) {
        // If themes have already been created, exit loop
        break;
      } else if (!theme) {
        await this.actions.create({
          slug: slug,
          '@context': { '@vocab': 'http://virtual-assembly.org/ontologies/pair#' },
          '@type': 'Thema',
          preferedLabel: themeLabel
        });
      }
    }
  }
};

module.exports = ThemeService;
