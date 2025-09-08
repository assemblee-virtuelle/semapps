import { ActionSchema } from 'moleculer';

export const action = {
  visibility: 'public',
  params: {
    // @ts-expect-error TS(2322): Type '{ type: "string"; optional: false; }' is not... Remove this comment to see the full error message
    resourceUri: { type: 'string', optional: false }
  },
  async handler(ctx) {
    const { resourceUri } = ctx.params;

    const isContainer = await ctx.call('ldp.container.exist', { containerUri: resourceUri });

    await ctx.call('triplestore.update', {
      query: `
        PREFIX acl: <http://www.w3.org/ns/auth/acl#>
        // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
        WITH <${this.settings.graphName}>
        DELETE { ?auth ?p2 ?o }
        WHERE { ?auth ?p <${resourceUri}>.
          FILTER (?p IN (acl:accessTo, acl:default ) )
          ?auth ?p2 ?o  }
      `,
      webId: 'system'
    });

    ctx.emit(
      'webacl.resource.deleted',
      // @ts-expect-error TS(2339): Property 'dataset' does not exist on type '{}'.
      { uri: resourceUri, dataset: ctx.meta.dataset, isContainer },
      { meta: { webId: null, dataset: null } }
    );
  }
} satisfies ActionSchema;
