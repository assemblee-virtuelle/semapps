const urlJoin = require('url-join');
const fetch = require('node-fetch');
const { MIME_TYPES } = require('@semapps/mime-types');
const ImporterMixin = require('./importer');

module.exports = {
  mixins: [ImporterMixin],
  settings: {
    source: {
      wordpress: {
        baseUrl: null,
        type: 'posts',
        appPassword: null
      },
      fieldsMapping: {
        slug: 'slug',
        created: 'date',
        updated: 'modified'
      }
    },
    dest: {
      filesContainerUri: null
    }
  },
  created() {
    if (this.settings.source.wordpress.type === 'posts') {
      this.settings.source.apiUrl = this.settings.source.wordpress.baseUrl;
      this.settings.source.getAllCompact = urlJoin(this.settings.source.wordpress.baseUrl, 'wp-json/wp/v2/posts');
      this.settings.source.getOneFull = data =>
        urlJoin(this.settings.source.wordpress.baseUrl, 'wp-json/wp/v2/posts', `${data.id}`);
      if (this.settings.source.wordpress.appPassword) {
        this.settings.source.basicAuth = {
          user: 'SemApps',
          password: this.settings.source.wordpress.appPassword
        };
      }
    } else {
      throw new Error('The WordpressImporterMixin can only import posts for now');
    }
  },
  methods: {
    async list(url) {
      let data = [];
      let page = 1;

      while (true) {
        this.logger.info(`Getting 10 results of page ${page}...`);
        const results = await this.fetch(`${url}?per_page=10&page=${page}`);
        if (results) {
          data.push(...results);
          page++;
        } else {
          return data;
        }
      }
    },
    async retrieveMedia(mediaUri) {
      const mediaData = await this.fetch(mediaUri);

      if (mediaData) {
        const imageUrl = mediaData.guid?.rendered;

        const response = await fetch(imageUrl);
        const file = new File(await response.arrayBuffer(), mediaData.slug, { type: mediaData.mime_type });

        return await this.broker.call('ldp.container.post', {
          containerUri: this.settings.dest.filesContainerUri,
          slug: mediaData.slug,
          file,
          contentType: MIME_TYPES.JSON
        });
      }
    }
  }
};
