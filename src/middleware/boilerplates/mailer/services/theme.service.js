const { JsonLdStorageMixin } = require('@semapps/ldp');
const MongoDbAdapter = require('moleculer-db-adapter-mongo');
const slugify = require('slugify');
const CONFIG = require('../config');

const ThemeService = {
  name: 'theme',
  mixins: [JsonLdStorageMixin],
  adapter: new MongoDbAdapter(CONFIG.MONGODB_URL),
  collection: 'themes',
  settings: {
    containerUri: CONFIG.HOME_URL + 'themes/',
    context: 'https://www.w3.org/ns/activitystreams',
    themes: [
      'Agriculture & alimentation',
      'Economie locale',
      'Démocratie',
      'Arts & culture',
      'Education',
      'Habitat & oasis',
      'Energie',
      'Transport',
      'Bien-être',
      'Autre'
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
          '@context': { '@vocab': 'http://virtual-assembly.org/ontologies/pair' },
          type: 'Thema',
          preferedLabel: themeLabel
        });
      }
    }
  }
};

module.exports = ThemeService;
