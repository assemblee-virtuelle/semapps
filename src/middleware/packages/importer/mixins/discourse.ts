import urlJoin from 'url-join';
import { ServiceSchema } from 'moleculer';
import ImporterMixin from './importer.ts';

const Schema = {
  mixins: [ImporterMixin],
  settings: {
    source: {
      discourse: {
        baseUrl: null,
        type: 'topics'
      },
      fieldsMapping: {
        slug: 'slug',
        created: 'created_at',
        updated: data => data.last_posted_at || data.created_at
      }
    }
  },
  created() {
    if (this.settings.source.discourse.type === 'topics') {
      this.settings.source.apiUrl = this.settings.source.discourse.baseUrl;
      this.settings.source.getAllCompact = urlJoin(this.settings.source.discourse.baseUrl, 'latest.json');
      this.settings.source.getOneFull = data => urlJoin(this.settings.source.discourse.baseUrl, 't', `${data.id}.json`);
    } else {
      throw new Error('The DiscourseImporterMixin can only import topics for now');
    }
  },
  methods: {
    async list(url) {
      if (this.settings.source.discourse.type === 'topics') {
        const topics = [];
        let page = 0;
        let result;

        do {
          result = await this.fetch(`${url}?page=${page}`);
          topics.push(...result.topic_list.topics);
          page++;
        } while (result.topic_list.more_topics_url);

        return topics;
      }
    }
  }
} satisfies ServiceSchema;

export default Schema;
