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
      this.settings.source.apiUrl = 'https://api.jotform.com';
      this.settings.source.headers = { apikey: this.settings.source.jotform.apiKey };
      this.settings.source.getAllCompact = 'https://api.jotform.com/user/forms';
      this.settings.source.getOneFull = data => 'https://api.jotform.com/submission/' + data.id;
    } else {
      throw new Error('The JotformImporterMixin can only import submissions for now');
    }
  },
  methods: {
    async list(url) {
      if (this.settings.source.discourse.type === 'submissions') {
        let submissions = [];
        const forms = await this.fetch(url);

        for (const form of forms) {
          const result = await this.fetch('https://api.jotform.com/form/' + form.id + '/submissions');
          submissions.push(...result);
        }

        return submissions;
      }
    }
  }
};
