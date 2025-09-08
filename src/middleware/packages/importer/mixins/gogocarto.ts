import urlJoin from 'url-join';
import { ServiceSchema } from 'moleculer';
import ImporterMixin from './importer.ts';

const Schema = {
  mixins: [ImporterMixin],
  settings: {
    source: {
      gogocarto: {
        baseUrl: null,
        type: 'elements'
      },
      fieldsMapping: {
        slug: 'name',
        created: 'createdAt',
        updated: 'updatedAt'
      }
    }
  },
  created() {
    if (this.settings.source.gogocarto.type === 'elements') {
      this.settings.source.apiUrl = urlJoin(this.settings.source.gogocarto.baseUrl, 'api', 'elements');
      this.settings.source.getAllFull = urlJoin(this.settings.source.gogocarto.baseUrl, 'api', 'elements');
      this.settings.source.getAllCompact = `${urlJoin(
        this.settings.source.gogocarto.baseUrl,
        'api',
        'elements'
      )}?ontology=gogosync`;
      this.settings.source.getOneFull = data =>
        urlJoin(this.settings.source.gogocarto.baseUrl, 'api', 'elements', `${data.id}`);
    } else {
      throw new Error('The GoGoCartoMixin can only import elements for now');
    }
  },
  methods: {
    async list(url) {
      const result = await this.fetch(url);
      return result.data;
    },
    async getOne(url) {
      const result = await this.fetch(url);
      return result.data;
    }
  }
} satisfies Partial<ServiceSchema>;

export default Schema;
