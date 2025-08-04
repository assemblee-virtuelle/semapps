const ImporterMixin = require('./importer');
const { convertToIsoString } = require('../utils');

module.exports = {
  mixins: [ImporterMixin],
  settings: {
    source: {
      jotform: {
        apiKey: null,
        type: 'submissions'
      },
      fieldsMapping: {
        slug: 'id',
        created: data => convertToIsoString(data.created_at),
        updated: data => convertToIsoString(data.updated_at)
      }
    }
  },
  created() {
    if (this.settings.source.jotform.type === 'submissions') {
      this.settings.source.apiUrl = 'https://eu-api.jotform.com';
      this.settings.source.headers = { apikey: this.settings.source.jotform.apiKey };
      this.settings.source.getAllCompact = 'https://eu-api.jotform.com/user/forms';
      this.settings.source.getOneFull = data => `https://eu-api.jotform.com/submission/${data.id}`;
    } else {
      throw new Error('The JotformImporterMixin can only import submissions for now');
    }
  },
  methods: {
    async list(url) {
      if (this.settings.source.jotform.type === 'submissions') {
        const submissions = [];
        const result1 = await this.fetch(url);
        if (result1.responseCode === 200) {
          for (const form of result1.content) {
            const result2 = await this.fetch(`https://eu-api.jotform.com/form/${form.id}/submissions`);
            if (result2.responseCode === 200) {
              submissions.push(...result2.content);
            }
          }
        }
        return submissions;
      }
    },
    async getOne(url) {
      const result = await this.fetch(url);
      if (result.responseCode === 200) {
        return result.content;
      }
      return false;
    }
  }
};
