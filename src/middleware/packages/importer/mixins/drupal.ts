import { ServiceSchema } from 'moleculer';
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
        created: (data: any) => convertToIsoString(data.published),
        updated: (data: any) => convertToIsoString(data.updated)
      }
    }
  },
  methods: {
    async list(url) {
      const data = await this.fetch(url);
      if (data && data.nodes) {
        return data.nodes.map((n: any) => n.node);
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
  // @ts-expect-error TS(1360): Type '{ mixins: { settings: { source: { apiUrl: nu... Remove this comment to see the full error message
} satisfies ServiceSchema;

export default Schema;
