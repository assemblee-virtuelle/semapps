import urlJoin from 'url-join';
import { ServiceSchema } from 'moleculer';
import ImporterMixin from './importer.ts';
import { convertToIsoString } from '../utils.ts';

const Schema = {
  mixins: [ImporterMixin],
  settings: {
    source: {
      prestashop: {
        baseUrl: null,
        type: null,
        wsKey: null
      },
      headers: {
        'Output-Format': 'JSON'
      },
      fieldsMapping: {
        slug: 'link_rewrite',
        created: (data: any) => convertToIsoString(data.date_add),
        updated: (data: any) => convertToIsoString(data.date_upd)
      }
    }
  },
  created() {
    this.settings.source.apiUrl = urlJoin(
      this.settings.source.prestashop.baseUrl,
      'api',
      this.settings.source.prestashop.type
    );
    this.settings.source.getAllFull = `${urlJoin(
      this.settings.source.prestashop.baseUrl,
      'api',
      this.settings.source.prestashop.type
    )}?display=full`;
    this.settings.source.getAllCompact = `${urlJoin(
      this.settings.source.prestashop.baseUrl,
      'api',
      this.settings.source.prestashop.type
    )}?display=[id,date_upd]`;
    this.settings.source.getOneFull = (data: any) =>
      urlJoin(this.settings.source.prestashop.baseUrl, 'api', this.settings.source.prestashop.type, `${data.id}`);
    this.settings.source.headers.Authorization = `Basic ${Buffer.from(
      `${this.settings.source.prestashop.wsKey}:`
    ).toString('base64')}`;
  },
  methods: {
    async list(url) {
      const result = await this.fetch(url);
      return Object.values(result)[0];
    },
    async getOne(url) {
      const result = await this.fetch(url);
      if (result) {
        return {
          // @ts-expect-error TS(2698): Spread types may only be created from object types... Remove this comment to see the full error message
          ...Object.values(result)[0],
          type: Object.keys(result)[0]
        };
      }
      return false;
    }
  }
} satisfies Partial<ServiceSchema>;

export default Schema;
