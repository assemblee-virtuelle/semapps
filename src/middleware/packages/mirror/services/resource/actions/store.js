const urlJoin = require("url-join");
const { MIME_TYPES } = require("@semapps/mime-types");

module.exports = {
  visibility: 'public',
  params: {
    resourceUri: { type: 'string' },
    keepInSync: { type: 'boolean', default: false },
    webId: { type: 'string', optional: true }
  },
  async handler(ctx) {
    let { resourceUri, keepInSync, webId } = ctx.params;

    if (!this.isRemoteUri(resourceUri)) {
      throw new Error('The resourceUri param must be remote. Provided: ' + resourceUri)
    }

    const resource = await this.actions.fetch({ resourceUri, webId }, { parentCtx: ctx });

    let containerUri, dataset;
    const container = await ctx.call('ldp.registry.getByType', { type: resource.type || resource['@type'] });

    if (this.settings.podProvider) {
      const account = await ctx.call('auth.account.findByWebId', { webId });
      containerUri = urlJoin(this.settings.baseUri, container.fullPath.replace(':username', account.username));
      dataset = account.username;
    } else {
      containerUri = urlJoin(this.settings.baseUri, container.path);
    }

    // Delete the existing cached resource (if it exists)
    await this.actions.delete({ resourceUri, webId }, { parentCtx: ctx });

    await ctx.call('triplestore.insert', {
      resource: `<${containerUri}> <http://www.w3.org/ns/ldp#contains> <${resourceUri}>`,
      webId: 'system',
      dataset
    });

    if (keepInSync) {
      resource['http://semapps.org/ns/core#singleMirroredResource'] = new URL(resourceUri).origin;
    }

    await ctx.call('triplestore.insert', {
      resource,
      contentType: MIME_TYPES.JSON,
      webId: 'system',
      dataset
    });
  }
};

