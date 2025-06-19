import { ServiceSchema } from 'moleculer';
import ImporterMixin from './importer.ts';
import { convertToIsoString } from '../utils.ts';

const Schema = {
  mixins: [ImporterMixin],
  settings: {
    source: {
      yeswiki: {
        baseUrl: null,
        oldApi: false,
        formId: null
      },
      fieldsMapping: {
        slug: 'id_fiche',
        created: data => convertToIsoString(data.date_creation_fiche),
        updated: data => convertToIsoString(data.date_maj_fiche)
      }
    }
  },
  created() {
    const { baseUrl, oldApi, formId } = this.settings.source.yeswiki;
    if (oldApi) {
      // Note: the form_id parameter is not used by YesWiki, but it allows to have a different base URL for each Bazar list
      this.settings.source.apiUrl = `${baseUrl}?BazaR/json&demand=entry&form_id=${formId}`;
      this.settings.source.getAllFull = `${baseUrl}?BazaR/json&demand=entries&id=${formId}`;
      this.settings.source.getOneFull = data =>
        `${baseUrl}?BazaR/json&demand=entry&form_id=${formId}&id_fiche=${data.id_fiche}`;
    } else {
      const apiPath = `api/forms/${formId}/entries/json`;
      this.settings.source.apiUrl = `${baseUrl}?${apiPath}`;
      this.settings.source.getAllFull = `${baseUrl}?${apiPath}`;
      this.settings.source.getAllCompact = `${baseUrl}?${apiPath}&fields=id_fiche,date_maj_fiche`;
      this.settings.source.getOneFull = data => `${baseUrl}?${apiPath}/${data.id_fiche}`;
    }
  },
  methods: {
    async list(url) {
      const data = await this.fetch(url);
      return Object.values(data);
    },
    async getOne(url) {
      const data = await this.fetch(url);
      if (data) {
        return Object.values(data)[0];
      }
      return false;
    }
  }
} satisfies ServiceSchema;

export default Schema;
