const { MIME_TYPES } = require("@semapps/mime-types");

module.exports = {
  visibility: 'public',
  params: {
    resourceUri: { type: 'string', optional: true },
    resource: { type: 'object', optional: true },
    keepInSync: { type: 'boolean', default: false },
    mirrorGraph: { type: 'boolean', default: false },
    webId: { type: 'string', optional: true }
  },
  async handler(ctx) {
    let { resourceUri, resource, keepInSync, mirrorGraph, webId } = ctx.params;

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

    if (!this.isRemoteUri(resourceUri)) {
      throw new Error('The resourceUri param must be remote. Provided: ' + resourceUri)
    }

    let dataset;
    if (this.settings.podProvider) {
      const account = await ctx.call('auth.account.findByWebId', { webId });
      dataset = account.username;
    }

    // Delete the existing cached resource (if it exists)
    await this.actions.delete({ resourceUri, webId }, { parentCtx: ctx });

    if (keepInSync) {
      resource['http://semapps.org/ns/core#singleMirroredResource'] = new URL(resourceUri).origin;
    }

    await ctx.call('triplestore.insert', {
      resource,
      graphName: mirrorGraph ? this.settings.mirrorGraphName : undefined,
      contentType: MIME_TYPES.JSON,
      webId: 'system',
      dataset
    });
  }
};

