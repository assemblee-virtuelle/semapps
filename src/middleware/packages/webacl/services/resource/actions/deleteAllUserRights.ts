import { defineAction } from 'moleculer';

// eslint-disable-next-line import/prefer-default-export
export const action = defineAction({
  visibility: 'public',
  params: {
    webId: { type: 'string', optional: false }
  },
  async handler(ctx) {
    const { webId } = ctx.params;

    await ctx.call('triplestore.update', {
      query: `
        PREFIX acl: <http://www.w3.org/ns/auth/acl#>
        WITH <${
          // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
          this.settings.graphName
        }>
        DELETE { ?auth acl:agent <${webId}>  }
        WHERE { ?auth acl:agent <${webId}>  }
      `,
      webId: 'system'
    });

    ctx.emit(
      'webacl.resource.user-deleted',
      // @ts-expect-error TS(2339): Property 'dataset' does not exist on type '{}'.
      { webId, dataset: ctx.meta.dataset },
      { meta: { webId: null, dataset: null } }
    );
  }
});
