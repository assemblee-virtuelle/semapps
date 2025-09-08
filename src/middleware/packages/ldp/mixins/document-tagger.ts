import { dc } from '@semapps/ontologies';
import { ServiceSchema } from 'moleculer';
import { getDatasetFromUri } from '../utils.ts';

const Schema = {
  settings: {
    documentPredicates: {
      created: 'http://purl.org/dc/terms/created',
      updated: 'http://purl.org/dc/terms/modified',
      creator: 'http://purl.org/dc/terms/creator'
    }
  },
  async started() {
    await this.broker.call('ontologies.register', dc);
  },
  actions: {
    tagCreatedResource: {
      async handler(ctx) {
        const { resourceUri, newData, webId, dataset } = ctx.params;
        const now = new Date();
        const triples = [];

        if (!newData['dc:created']) {
          triples.push(
            `<${resourceUri}> <${
              this.settings.documentPredicates.created
            }> "${now.toISOString()}"^^<http://www.w3.org/2001/XMLSchema#dateTime> .`
          );
        }

        if (!newData['dc:modified']) {
          triples.push(
            `<${resourceUri}> <${
              this.settings.documentPredicates.updated
            }> "${now.toISOString()}"^^<http://www.w3.org/2001/XMLSchema#dateTime> .`
          );
        }

        if (!newData['dc:creator'] && webId && webId.startsWith('http')) {
          triples.push(`<${resourceUri}> <${this.settings.documentPredicates.creator}> <${webId}> .`);
        }

        if (triples.length > 0) {
          await ctx.call('triplestore.update', {
            query: `INSERT DATA { ${triples.join('\n')} }`,
            dataset: this.settings.podProvider ? dataset || getDatasetFromUri(resourceUri) : undefined,
            webId: 'system'
          });
        }
      }
    },

    tagUpdatedResource: {
      async handler(ctx) {
        const { resourceUri, dataset } = ctx.params;
        const now = new Date();
        await ctx.call('triplestore.update', {
          query: `
            DELETE { <${resourceUri}> <${this.settings.documentPredicates.updated}> ?updated }
            INSERT { <${resourceUri}> <${
              this.settings.documentPredicates.updated
            }> "${now.toISOString()}"^^<http://www.w3.org/2001/XMLSchema#dateTime> }
            WHERE { <${resourceUri}> <${this.settings.documentPredicates.updated}> ?updated }
          `,
          dataset: this.settings.podProvider ? dataset || getDatasetFromUri(resourceUri) : undefined,
          webId: 'system'
        });
      }
    }
  },
  events: {
    'ldp.resource.created': {
      async handler(ctx) {
        // @ts-expect-error TS(2339): Property 'resourceUri' does not exist on type 'Opt... Remove this comment to see the full error message
        const { resourceUri, newData, webId, dataset } = ctx.params;
        // @ts-expect-error TS(2339): Property 'actions' does not exist on type 'Service... Remove this comment to see the full error message
        this.actions.tagCreatedResource(
          // @ts-expect-error TS(2339): Property 'impersonatedUser' does not exist on type... Remove this comment to see the full error message
          { resourceUri, newData, webId: ctx.meta.impersonatedUser || webId, dataset },
          { parentCtx: ctx }
        );
      }
    },

    'ldp.resource.updated': {
      async handler(ctx) {
        // @ts-expect-error TS(2339): Property 'resourceUri' does not exist on type 'Opt... Remove this comment to see the full error message
        const { resourceUri, dataset } = ctx.params;
        // @ts-expect-error TS(2339): Property 'actions' does not exist on type 'Service... Remove this comment to see the full error message
        this.actions.tagUpdatedResource({ resourceUri, dataset }, { parentCtx: ctx });
      }
    },

    'ldp.resource.patched': {
      async handler(ctx) {
        // @ts-expect-error TS(2339): Property 'resourceUri' does not exist on type 'Opt... Remove this comment to see the full error message
        const { resourceUri, dataset } = ctx.params;
        // @ts-expect-error TS(2339): Property 'actions' does not exist on type 'Service... Remove this comment to see the full error message
        this.actions.tagUpdatedResource({ resourceUri, dataset }, { parentCtx: ctx });
      }
    }
  }
} satisfies Partial<ServiceSchema>;

export default Schema;
