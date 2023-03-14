module.exports = {
  visibility: 'public',
  params: {
    resourceUri: { type: 'string' },
    webId: { type: 'string', optional: true }
  },
  async handler(ctx) {
    const { resourceUri, webId } = ctx.params;

    if (!this.isRemoteUri(resourceUri, ctx.meta.dataset)) {
      throw new Error('The resourceUri param must be remote. Provided: ' + resourceUri)
    }

    let dataset;

    if (this.settings.podProvider) {
      const account = await ctx.call('auth.account.findByWebId', { webId });
      dataset = account.username;
    }

    const graphName = await this.actions.getGraph({ resourceUri, dataset }, { parentCtx: ctx });

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
        webId: 'system',
        dataset
      });

      // Detach from all containers with the mirrored resource
      const containers = await ctx.call('ldp.resource.getContainers', { resourceUri, dataset });
      for (let containerUri of containers) {
        await ctx.call(
          'ldp.container.detach',
          { containerUri, resourceUri, dataset, webId: 'system' },
          { meta: { forceMirror: true } }
        );
      }

      await ctx.call('triplestore.deleteOrphanBlankNodes', {
        dataset,
        graphName
      });

      ctx.emit(
        'ldp.remote.deleted',
        { resourceUri, dataset },
        { meta: { webId: null, dataset: null, isMirror: true } }
      );
    }
  }
};

