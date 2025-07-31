import { defineAction } from 'moleculer';

export const action = defineAction({
  visibility: 'public',
  params: {
    resourceUri: { type: 'string', optional: false }
  },
  async handler(ctx) {
    const { resourceUri } = ctx.params;

    const isContainer = await ctx.call('ldp.container.exist', { containerUri: resourceUri });

    await ctx.call('triplestore.update', {
      query: `
        PREFIX acl: <http://www.w3.org/ns/auth/acl#>
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
});
