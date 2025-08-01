import ImporterMixin from './importer.ts';
import { convertToIsoString } from '../utils.ts';

const Schema = {
  mixins: [ImporterMixin],
  settings: {
    source: {
      apiUrl: null,
      getAllCompact: null,
      getOneFull: null,
      basicAuth: {
        user: null,
        password: null
      },
      fetchOptions: {
        compress: false // Solve bug in Drupal
      },
      fieldsMapping: {
        slug: 'uuid',
        created: data => convertToIsoString(data.published),
        updated: data => convertToIsoString(data.updated)
      }
    }
  },
  methods: {
    async list(url) {
      const data = await this.fetch(url);
      if (data && data.nodes) {
        return data.nodes.map(n => n.node);
      }
      return false;
    },
    async getOne(url) {
      const data = await this.fetch(url);
      if (data && data.nodes && data.nodes.length > 0) {
        return data.nodes[0].node;
      }
      return false;
    }
  }
};

export default Schema;
