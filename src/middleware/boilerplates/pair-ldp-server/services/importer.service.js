const urlJoin = require('url-join');
const { ImporterService } = require('@semapps/importer');
const { MIME_TYPES } = require('@semapps/mime-types');
const path = require('path');
const slugify = require('slugify');
const CONFIG = require('../config');

const convertWikiNames = str =>
  str
    .substring(0, 36)
    .replace(/([a-zA-Z])(?=[A-Z])/g, '$1-')
    .toLowerCase();

const convertWikiDate = str => str && str.replace(' ', 'T');

module.exports = {
  mixins: [ImporterService],
  settings: {
    importsDir: path.resolve(__dirname, '../imports'),
    allowedActions: ['createProject', 'createTheme']
  },
  dependencies: ['ldp'],
  actions: {
    async createTheme(ctx) {
      const { data: themeName } = ctx.params;

      await ctx.call('ldp.resource.post', {
        resource: {
          '@context': {
            pair: 'http://virtual-assembly.org/ontologies/pair#'
          },
          '@type': 'pair:Theme',
          'pair:label': themeName
        },
        slug: slugify(themeName, { lower: true }),
        containerUri: urlJoin(CONFIG.HOME_URL, 'themes'),
        contentType: MIME_TYPES.JSON
      });

      console.log(`Theme ${themeName} created`);
    },
    async createProject(ctx) {
      const { data } = ctx.params;

      const themes = data.tag.map(tag => urlJoin(CONFIG.HOME_URL, 'themes', slugify(tag.name, { lower: true })));
      const status = urlJoin(CONFIG.HOME_URL, 'status', slugify(data.status, { lower: true }));

      await ctx.call('ldp.resource.post', {
        resource: {
          '@context': [
            'https://www.w3.org/ns/activitystreams',
            {
              pair: 'http://virtual-assembly.org/ontologies/pair#'
            }
          ],
          '@type': 'pair:Project',
          // PAIR
          'pair:label': data.name,
          'pair:description': data.content,
          'pair:aboutPage': data.url,
          'pair:hasTopic': themes.map(theme => ({ '@id': theme })),
          'pair:hasStatus': {
            '@id': status
          },
          // ActivityStreams
          image: data.image,
          location: data.location,
          published: convertWikiDate(data.published),
          updated: convertWikiDate(data.updated)
        },
        slug: convertWikiNames(data.slug),
        containerUri: urlJoin(CONFIG.HOME_URL, 'projects'),
        contentType: MIME_TYPES.JSON
      });

      console.log(`Project ${data.name} created`);
    },
    async importAll(ctx) {
      // await this.actions.import({
      //   action: 'createTheme',
      //   fileName: 'themes.json'
      // });

      await this.actions.import({
        action: 'createProject',
        fileName: 'projets-pc.json'
      });
    }
  }
};
