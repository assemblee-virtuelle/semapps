const { JsonLdStorageMixin } = require('@semapps/activitypub');
const slugify = require('slugify')

const ThemeService = {
  name: 'theme',
  mixins: [JsonLdStorageMixin],
  adapter: null, // To be set by the user
  collection: 'themes',
  settings: {
    containerUri: null, // To be set by the user
    context: 'https://www.w3.org/ns/activitystreams',
    themes: []
  },
  async started() {
    let theme = null;
    for( let themeLabel of this.settings.themes ) {
      // TODO put in LDP service
      const slug = slugify(themeLabel, { lower: true });

      try {
        theme = await this.actions.get({ id: this.settings.containerUri + slug });
      } catch( e ) {
        // Themes have already been created, exit loop
        return;
      }

      if( !theme ) {
        await this.actions.create({
          'slug': slug,
          '@context': { '@vocab': 'http://virtual-assembly.org/ontologies/pair' },
          'type': 'Thema',
          'preferedLabel': themeLabel
        });
      }
    }
  }
};

module.exports = ThemeService;
