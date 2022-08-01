const urlJoin = require('url-join');
const ImporterMixin = require('./importer');
const { convertToIsoString } = require('../utils');

const allowedTypes = ['user', 'space', 'calendar', 'post'];

module.exports = {
  mixins: [ImporterMixin],
  settings: {
    source: {
      humhub: {
        baseUrl: null,
        jwtToken: null,
        type: null // 'user', 'space'
      },
      fieldsMapping: {
        slug: 'id_fiche',
        created: data => convertToIsoString(data.date_creation_fiche),
        updated: data => convertToIsoString(data.date_maj_fiche)
      }
    }
  },
  created() {
    const { baseUrl, jwtToken, type } = this.settings.source.humhub;

    if (!jwtToken) throw new Error('The source.humhub.jwtSettings setting is missing');
    if (!allowedTypes.includes(type)) throw new Error('Only the following types are allowed: ' + allowedTypes.join(', '));

    this.settings.source.headers.Authorization = `Bearer ${jwtToken}`;

    const apiPath = `/api/v1/${type}`;
    this.settings.source.apiUrl = urlJoin(baseUrl, apiPath);
    this.settings.source.getAllFull = this.settings.source.apiUrl;
    this.settings.source.getOneFull = data => `${this.settings.source.apiUrl}/${data.id}`;
  },
  methods: {
    async list(url) {
      let results, data = [], page = 0;

      do {
        page++;
        results = await this.fetch(`${url}?per-page=100&page=${page}` );
        data.push(...results.results);
      } while(results.links.next);

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
    // async getOne(url) {
    //   const results = await this.getOne(url);
    //
    //   // Append the members to the result
    //   if (this.settings.source.humhub.type === 'space' && results) {
    //     results.members = await this.fetch(urlJoin(url, 'membership'));
    //   }
    //
    //   return results
    // }
  }
};
