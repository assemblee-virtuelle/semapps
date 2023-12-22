const { MIME_TYPES } = require('@semapps/mime-types');

module.exports = {
  visibility: 'public',
  params: {
    resourceUri: { type: 'string', optional: true },
    resource: { type: 'object', optional: true },
    keepInSync: { type: 'boolean', default: false },
    mirrorGraph: { type: 'boolean', default: false },
    webId: { type: 'string', optional: true },
    dataset: { type: 'string', optional: true }
  },
  async handler(ctx) {
    let { resourceUri, resource, keepInSync, mirrorGraph, webId, dataset } = ctx.params;
    const graphName = mirrorGraph ? this.settings.mirrorGraphName : undefined;

    if (!resource && !resourceUri) {
      throw new Error('You must provide the resourceUri or resource param');
    }

    if (keepInSync && !mirrorGraph) {
      throw new Error('To be kept in sync, a remote resource must stored in the mirror graph');
    }

    if (!resource) {
      resource = await this.actions.getNetwork({ resourceUri, webId }, { parentCtx: ctx });
    }

    if (!resourceUri) {
      resourceUri = resource.id || resource['@id'];
    }

    if (!this.isRemoteUri(resourceUri, webId)) {
      throw new Error(`The resourceUri param must be remote. Provided: ${resourceUri} (webId ${webId})`);
    }

    if (!dataset && this.settings.podProvider) {
      const account = await ctx.call('auth.account.findByWebId', { webId });
      dataset = account.username;
    }

    // Delete the existing cached resource (if it exists)
    await ctx.call('triplestore.update', {
      query: `
        DELETE
        WHERE { 
          ${graphName ? `GRAPH <${graphName}> {` : ''}
            <${resourceUri}> ?p1 ?o1 .
          ${graphName ? '}' : ''}
        }
      `,
      webId,
      dataset
    });

    ctx.call('triplestore.deleteOrphanBlankNodes', {
      dataset,
      graphName
    });

    if (keepInSync) {
      resource['http://semapps.org/ns/core#singleMirroredResource'] = new URL(resourceUri).origin;
    }

    await ctx.call('triplestore.insert', {
      resource,
      graphName,
      contentType: MIME_TYPES.JSON,
      webId: 'system',
      dataset
    });

    ctx.emit(
      'ldp.remote.stored',
      { resourceUri, resource, dataset, mirrorGraph, keepInSync, webId },
      { meta: { webId: null, dataset } }
    );

    return resource;
  }
};
