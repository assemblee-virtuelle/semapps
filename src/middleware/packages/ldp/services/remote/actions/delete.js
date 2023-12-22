module.exports = {
  visibility: 'public',
  params: {
    resourceUri: { type: 'string' },
    webId: { type: 'string', optional: true }
  },
  async handler(ctx) {
    const { resourceUri, webId } = ctx.params;

    if (!this.isRemoteUri(resourceUri, webId)) {
      throw new Error(`The resourceUri param must be remote. Provided: ${resourceUri} (webId ${webId})`);
    }

    if (this.settings.podProvider) {
      const account = await ctx.call('auth.account.findByWebId', { webId });
      ctx.meta.dataset = account.username;
    }

    const graphName = await this.actions.getGraph({ resourceUri }, { parentCtx: ctx });

    if (graphName !== false) {
      await ctx.call('triplestore.update', {
        query: `
          DELETE
          WHERE { 
            ${graphName ? `GRAPH <${graphName}> {` : ''}
              <${resourceUri}> ?p1 ?o1 .
            ${graphName ? '}' : ''}
          }
        `,
        webId: 'system'
      });

      // Detach from all containers with the mirrored resource
      const containers = await ctx.call('ldp.resource.getContainers', { resourceUri });
      for (const containerUri of containers) {
        await ctx.call('ldp.container.detach', { containerUri, resourceUri, webId: 'system' });
      }

      ctx.call('triplestore.deleteOrphanBlankNodes', {
        graphName
      });

      ctx.emit(
        'ldp.remote.deleted',
        { resourceUri, webId, dataset: ctx.meta.dataset },
        { meta: { webId: null, dataset: null } }
      );
    }
  }
};
