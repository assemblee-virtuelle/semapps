module.exports = {
  action: {
    visibility: 'public',
    params: {
      resourceUri: { type: 'string', optional: false }
    },
    async handler(ctx) {
      const { resourceUri } = ctx.params;

      const isContainer = await ctx.call('ldp.container.exist', { containerUri: resourceUri, webId: 'system' });

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
        { uri: resourceUri, dataset: ctx.meta.dataset, isContainer },
        { meta: { webId: null, dataset: null } }
      );
    }
  }
};
