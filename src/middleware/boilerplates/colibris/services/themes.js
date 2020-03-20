const { JsonLdStorageMixin } = require('@semapps/ldp');
const slugify = require('slugify');

const ThemeService = {
  name: 'themes',
  mixins: [JsonLdStorageMixin],
  adapter: null, // To be set by the user
  collection: 'themes',
  settings: {
    containerUri: null, // To be set by the user
    context: { '@vocab': 'http://virtual-assembly.org/ontologies/pair#' },
    themes: []
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
        const result = await this.actions.create({
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
