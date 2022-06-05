const { MoleculerError } = require('moleculer').Errors;
const { isMirror } = require('../../../utils');

module.exports = {
  visibility: 'public',
  params: {
    containerUri: { type: 'string' },
    resourceUri: { type: 'string' },
    webId: {
      type: 'string',
      optional: true
    }
  },
  async handler(ctx) {
    const { containerUri, resourceUri } = ctx.params;
    const webId = ctx.params.webId || ctx.meta.webId || 'anon';
    const dataset = ctx.meta.dataset; // Save dataset, so that it is not modified by action calls below

    if (isMirror(containerUri, this.settings.baseUrl))
      throw new MoleculerError('Mirrored containers cannot be modified', 403, 'FORBIDDEN');

    const resourceExists = await ctx.call('ldp.resource.exist', { resourceUri, webId });
    if (!resourceExists) {
      const childContainerExists = await this.actions.exist({ containerUri: resourceUri, webId }, { parentCtx: ctx });
      if (!childContainerExists) {
        //throw new Error('Cannot attach non-existing resource or container: ' + resourceUri);
        throw new MoleculerError('Cannot attach non-existing resource or container: ' + resourceUri, 404, 'NOT_FOUND');
      }
    }

    const containerExists = await this.actions.exist({ containerUri, webId }, { parentCtx: ctx });
    if (!containerExists) throw new Error('Cannot attach to a non-existing container: ' + containerUri);

    await ctx.call('triplestore.insert', {
      resource: `<${containerUri}> <http://www.w3.org/ns/ldp#contains> <${resourceUri}>`,
      webId,
      dataset
    });

    ctx.emit(
      'ldp.container.attached',
      {
        containerUri,
        resourceUri
      },
      { meta: { webId: null, dataset: null } }
    );
  }
};
