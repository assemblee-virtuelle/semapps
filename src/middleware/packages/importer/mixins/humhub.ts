import urlJoin from 'url-join';
import { ServiceSchema } from 'moleculer';
import ImporterMixin from './importer.ts';
import { convertToIsoString } from '../utils.ts';

const allowedTypes = ['user', 'space', 'calendar', 'post'];

const getSlugByUrl = url => {
  if (url) {
    const splitUrl = url.split('/');
    let slug = splitUrl.pop();
    // If slug is empty, there was an ending slash
    if (!slug) slug = splitUrl.pop();
    return slug;
  }
};

const Schema = {
  mixins: [ImporterMixin],
  settings: {
    source: {
      humhub: {
        baseUrl: null,
        jwtToken: null,
        type: null // 'user', 'space', 'calendar', 'post'
      },
      fieldsMapping: {
        // We don't use arrow function as we need to have access to this.settings
        slug: function (data) {
          switch (this.settings.source.humhub.type) {
            case 'user':
            case 'space':
              return getSlugByUrl(data.url);
            case 'calendar':
            case 'post':
              return data.content.metadata.guid;
          }
        },
        created: function (data) {
          switch (this.settings.source.humhub.type) {
            case 'calendar':
            case 'post':
              return convertToIsoString(data.content.metadata.created_at);
          }
        },
        updated: function (data) {
          switch (this.settings.source.humhub.type) {
            case 'calendar':
            case 'post':
              return convertToIsoString(data.content.metadata.updated_at);
          }
        }
      }
    }
  },
  created() {
    const { baseUrl, jwtToken, type } = this.settings.source.humhub;

    if (!jwtToken) throw new Error('The source.humhub.jwtSettings setting is missing');
    if (!allowedTypes.includes(type))
      throw new Error(`Only the following types are allowed: ${allowedTypes.join(', ')}`);

    this.settings.source.headers.Authorization = `Bearer ${jwtToken}`;

    const apiPath = `/api/v1/${type}`;
    this.settings.source.apiUrl = urlJoin(baseUrl, apiPath);
    this.settings.source.getAllFull = this.settings.source.apiUrl;

    if (type === 'calendar') {
      this.settings.source.getOneFull = data => `${this.settings.source.apiUrl}/entry/${data.id}`;
    } else {
      this.settings.source.getOneFull = data => `${this.settings.source.apiUrl}/${data.id}`;
    }
  },
  methods: {
    async list(url) {
      let results;
      const data = [];
      let page = 0;

      do {
        page++;
        results = await this.fetch(`${url}?per-page=100&page=${page}`);
        data.push(...results.results);
      } while (results.links.next);

      // Append the members to the result
      if (this.settings.source.humhub.type === 'space') {
        for (const key of data.keys()) {
          // TODO use the list method but avoid a loop ? Maybe set another importer for memberships
          // Currently if there is more than 100 members, it will fail to get them all
          const members = await this.fetch(urlJoin(url, `${data[key].id}`, 'membership'));
          data[key].members = members.results;
        }
      }

      return data;
    },
    async getOne(url) {
      const results = await this.fetch(url);

      // Append the members to the result
      if (this.settings.source.humhub.type === 'space' && results) {
        // TODO use the list method but avoid a loop ? Maybe set another importer for memberships
        // Currently if there is more than 100 members, it will fail to get them all
        const members = await this.fetch(urlJoin(url, 'membership'));
        results.members = members.results;
      }

      return results;
    }
  }
} satisfies ServiceSchema;

export default Schema;
