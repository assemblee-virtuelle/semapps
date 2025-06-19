import urlJoin from 'url-join';
import fetch from 'node-fetch';
import { getSlugFromUri, delay } from '@semapps/ldp';
import { MIME_TYPES } from '@semapps/mime-types';
import { ServiceSchema } from 'moleculer';
import ImporterMixin from './importer.ts';

const Schema = {
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
        this.logger.info(`Getting 30 results of page ${page}...`);
        const results = await this.fetch(`${url}?per_page=30&page=${page}`);
        if (results) {
          data.push(...results);
          page++;
        } else {
          return data;
        }
      }
    },
    async retrieveMedia(mediaId) {
      let mediaData;
      let attempts = 1;

      const mediaUrl = urlJoin(this.settings.source.wordpress.baseUrl, 'wp-json/wp/v2/media', `${mediaId}`);

      do {
        try {
          mediaData = await this.fetch(mediaUrl);
        } catch (e) {
          if (attempts <= 10) {
            attempts += 1;
            this.logger.warn(`Could not get ${mediaUrl}. Trying again in 30 seconds...`);
            await delay(30000);
          } else {
            throw new Error(e);
          }
        }
      } while (!mediaData);

      if (mediaData) {
        const imageUrl = mediaData.guid?.rendered;
        const imageName = getSlugFromUri(imageUrl);

        const response = await fetch(imageUrl);

        if (response.ok) {
          return await this.broker.call('ldp.container.post', {
            containerUri: this.settings.dest.filesContainerUri,
            slug: imageName,
            file: {
              filename: imageName,
              readableStream: response.body,
              mimetype: mediaData.mime_type
            },
            contentType: MIME_TYPES.JSON,
            webId: 'system'
          });
        } else {
          this.logger.warn(`Could not retrieve image ${imageUrl}`);
        }
      }
    }
  }
} satisfies ServiceSchema;

export default Schema;
