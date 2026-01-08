import { v4 as uuidv4 } from 'uuid';
import createSlug from 'speakingurl';
import urlJoin from 'url-join';
import { ServiceSchema } from 'moleculer';
import { AdapterInterface } from '../adapters/base.ts';

const NamedGraphService = {
  name: 'triplestore.named-graph' as const,
  settings: {
    defaultDataset: null,
    adapter: null as AdapterInterface | null
  },
  async created() {
    if (!this.settings.adapter) {
      throw new Error('Adapter is required');
    }
  },
  actions: {
    create: {
      async handler(ctx) {
        // TODO Do not allow to pass the named graph URI on creation
        let { baseUrl, slug, uri } = ctx.params;
        const dataset = ctx.params.dataset || ctx.meta.dataset || this.settings.defaultDataset;

        if (!uri) {
          // Ensure the slug does not contain special characters
          if (slug) slug = createSlug(slug, { lang: 'en', custom: { '.': '.', '/': '/' } });

          // Find an URI that does not already exists
          let counter = 0;
          do {
            if (slug) {
              if (counter > 0) {
                counter += 1;
                uri = urlJoin(baseUrl, slug + counter);
              } else {
                uri = urlJoin(baseUrl, slug);
              }
            } else {
              uri = urlJoin(baseUrl, uuidv4());
            }
          } while (await this.actions.exist({ uri, dataset }, { parentCtx: ctx }));
        }

        return await this.settings.adapter.createNamedGraph(dataset, uri);
      }
    },

    exist: {
      async handler(ctx) {
        const { uri } = ctx.params;
        if (!uri) throw new Error('Unable to check if named graph exists. The parameter uri is missing');
        const dataset = ctx.params.dataset || ctx.meta.dataset || this.settings.defaultDataset;

        return await this.settings.adapter.namedGraphExists(dataset, uri);
      }
    },

    clear: {
      async handler(ctx) {
        const { uri } = ctx.params;
        const dataset = ctx.params.dataset || ctx.meta.dataset || this.settings.defaultDataset;

        if (!uri) throw new Error('Unable to clear named graph. The parameter uri is missing');
        if (!dataset) throw new Error('Unable to clear named graph. The parameter dataset is missing');

        if (!(await this.actions.exist({ uri, dataset }, { parentCtx: ctx }))) {
          throw new Error(`Cannot clear named graph as it doesn't exist`);
        }

        await this.settings.adapter.clearNamedGraph(dataset, uri);
      }
    },

    delete: {
      async handler(ctx) {
        const { uri } = ctx.params;
        const dataset = ctx.params.dataset || ctx.meta.dataset || this.settings.defaultDataset;

        if (!uri) throw new Error('Unable to delete named graph. The parameter uri is missing');
        if (!dataset) throw new Error('Unable to delete named graph. The parameter dataset is missing');

        if (!(await this.actions.exist({ uri, dataset }, { parentCtx: ctx }))) {
          throw new Error(`Cannot delete named graph as it doesn't exist`);
        }

        await this.settings.adapter.deleteNamedGraph(dataset, uri);
      }
    }
  }
} satisfies ServiceSchema;

export default NamedGraphService;

declare global {
  export namespace Moleculer {
    export interface AllServices {
      [NamedGraphService.name]: typeof NamedGraphService;
    }
  }
}
