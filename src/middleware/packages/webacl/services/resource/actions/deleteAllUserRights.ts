import { ActionSchema } from 'moleculer';

export const action = {
  visibility: 'public',
  params: {
    // @ts-expect-error TS(2322): Type '{ type: "string"; optional: false; }' is not... Remove this comment to see the full error message
    webId: { type: 'string', optional: false }
  },
  async handler(ctx) {
    const { webId } = ctx.params;

    await ctx.call('triplestore.update', {
      query: `
        PREFIX acl: <http://www.w3.org/ns/auth/acl#>
        // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
        WITH <${this.settings.graphName}>
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
} satisfies ActionSchema;
