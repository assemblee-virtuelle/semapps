const { MoleculerError } = require('moleculer').Errors;

module.exports = {
  action: {
    visibility: 'public',
    params: {
      resourceUri: { type: 'string', optional: false },
    },
    async handler(ctx) {
      
      let { resourceUri } = ctx.params;

      if (ctx.meta.webId != 'system') throw new MoleculerError('Access denied ! only system can do that', 403, 'ACCESS_DENIED');

      // we do the 2 calls in one, so it is in the same transaction, and will rollback in case of failure.
      await ctx.call('triplestore.update',{
        query: `PREFIX acl: <http://www.w3.org/ns/auth/acl#>
        WITH ${this.settings.graphName}
        DELETE { ?auth ?p2 ?o }
        WHERE  { ?auth ?p <${resourceUri}>.
          FILTER (?p IN (acl:accessTo, acl:default ) )
          ?auth ?p2 ?o  }`,
        webId: 'system',
      })

    }   
  }
};
