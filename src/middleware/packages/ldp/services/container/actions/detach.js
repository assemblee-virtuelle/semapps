const { isMirror } = require('../../../utils');
const urlJoin = require('url-join');
const { MoleculerError } = require('moleculer').Errors;

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
    let { containerUri, resourceUri } = ctx.params;
    const webId = ctx.params.webId || ctx.meta.webId || 'anon';
    const dataset = ctx.meta.dataset; // Save dataset, so that it is not modified by action calls before

    const mirror = isMirror(containerUri, this.settings.baseUrl);
    if (mirror && !ctx.meta.forceMirror)
      throw new MoleculerError('Mirrored containers cannot be modified', 403, 'FORBIDDEN');

    if (new URL(containerUri).pathname === '/') {
      if (mirror) return; // indeed, we never have the root container on a mirror.
      containerUri = urlJoin(containerUri, '/');
    }
    const containerExists = await this.actions.exist({ containerUri, webId }, { parentCtx: ctx });
    if (!containerExists && mirror) return;
    if (!containerExists) throw new Error('Cannot detach from a non-existing container: ' + containerUri);

    await ctx.call('triplestore.update', {
      query: `
        DELETE
        WHERE
        { 
          ${mirror ? 'GRAPH <' + this.settings.mirrorGraphName + '> {' : ''}
          <${containerUri}> <http://www.w3.org/ns/ldp#contains> <${resourceUri}> 
          ${mirror ? '}' : ''}
        }
      `,
      webId,
      dataset
    });

    if (!mirror)
      ctx.emit(
        'ldp.container.detached',
        {
          containerUri,
          resourceUri
        },
        { meta: { webId: null, dataset: null } }
      );
  }
};
