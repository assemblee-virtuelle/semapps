import { dc } from '@semapps/ontologies';
import { ServiceSchema, defineAction, defineServiceEvent } from 'moleculer';
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
    tagCreatedResource: defineAction({
      async handler(ctx) {
        const { resourceUri, newData, webId, dataset } = ctx.params;
        const now = new Date();
        const triples = [];

        if (!newData['dc:created']) {
          triples.push(
            `<${resourceUri}> <${
              // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
              this.settings.documentPredicates.created
            }> "${now.toISOString()}"^^<http://www.w3.org/2001/XMLSchema#dateTime> .`
          );
        }

        if (!newData['dc:modified']) {
          triples.push(
            `<${resourceUri}> <${
              // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
              this.settings.documentPredicates.updated
            }> "${now.toISOString()}"^^<http://www.w3.org/2001/XMLSchema#dateTime> .`
          );
        }

        // @ts-expect-error TS(2339): Property 'startsWith' does not exist on type 'neve... Remove this comment to see the full error message
        if (!newData['dc:creator'] && webId && webId.startsWith('http')) {
          // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
          triples.push(`<${resourceUri}> <${this.settings.documentPredicates.creator}> <${webId}> .`);
        }

        if (triples.length > 0) {
          await ctx.call('triplestore.insert', {
            resource: triples.join('\n'),
            // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
            dataset: this.settings.podProvider ? dataset || getDatasetFromUri(resourceUri) : undefined,
            webId: 'system'
          });
        }
      }
    }),

    tagUpdatedResource: defineAction({
      async handler(ctx) {
        const { resourceUri, dataset } = ctx.params;
        const now = new Date();
        await ctx.call('triplestore.update', {
          query: `  
            DELETE { <${resourceUri}> <${
              // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
              this.settings.documentPredicates.updated
            }> ?updated }
            INSERT { <${resourceUri}> <${
              // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
              this.settings.documentPredicates.updated
            }> "${now.toISOString()}"^^<http://www.w3.org/2001/XMLSchema#dateTime> }
            WHERE { <${resourceUri}> <${
              // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
              this.settings.documentPredicates.updated
            }> ?updated }
          `,
          // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
          dataset: this.settings.podProvider ? dataset || getDatasetFromUri(resourceUri) : undefined,
          webId: 'system'
        });
      }
    })
  },
  events: {
    'ldp.resource.created': defineServiceEvent({
      async handler(ctx) {
        // @ts-expect-error TS(2339): Property 'resourceUri' does not exist on type 'Ser... Remove this comment to see the full error message
        const { resourceUri, newData, webId, dataset } = ctx.params;
        // @ts-expect-error TS(2339): Property 'actions' does not exist on type 'Service... Remove this comment to see the full error message
        this.actions.tagCreatedResource(
          // @ts-expect-error TS(2339): Property 'impersonatedUser' does not exist on type... Remove this comment to see the full error message
          { resourceUri, newData, webId: ctx.meta.impersonatedUser || webId, dataset },
          { parentCtx: ctx }
        );
      }
    }),

    'ldp.resource.updated': defineServiceEvent({
      async handler(ctx) {
        // @ts-expect-error TS(2339): Property 'resourceUri' does not exist on type 'Ser... Remove this comment to see the full error message
        const { resourceUri, dataset } = ctx.params;
        // @ts-expect-error TS(2339): Property 'actions' does not exist on type 'Service... Remove this comment to see the full error message
        this.actions.tagUpdatedResource({ resourceUri, dataset }, { parentCtx: ctx });
      }
    }),

    'ldp.resource.patched': defineServiceEvent({
      async handler(ctx) {
        // @ts-expect-error TS(2339): Property 'resourceUri' does not exist on type 'Ser... Remove this comment to see the full error message
        const { resourceUri, dataset } = ctx.params;
        // @ts-expect-error TS(2339): Property 'actions' does not exist on type 'Service... Remove this comment to see the full error message
        this.actions.tagUpdatedResource({ resourceUri, dataset }, { parentCtx: ctx });
      }
    })
  }
  // @ts-expect-error TS(1360): Type '{ settings: { documentPredicates: { created:... Remove this comment to see the full error message
} satisfies ServiceSchema;

export default Schema;
