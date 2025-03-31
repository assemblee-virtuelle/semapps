const { MoleculerError } = require('moleculer').Errors;
const { MIME_TYPES } = require('@semapps/mime-types');
const { v4: uuidv4 } = require('uuid');
const mime = require('mime-types');

module.exports = async function post(ctx) {
  try {
    const { username, slugParts, ...resource } = ctx.params;

    const containerUri = this.getUriFromSlugParts(slugParts, username);

    let resourceUri;
    const { controlledActions } = await ctx.call('ldp.registry.getByUri', { containerUri });
    if (ctx.meta.parser !== 'file') {
      resourceUri = await ctx.call(controlledActions.post || 'ldp.container.post', {
        containerUri,
        slug: ctx.meta.headers.slug,
        resource,
        contentType: ctx.meta.headers['content-type']
      });
    } else {
      if (ctx.params.files.length > 1) {
        throw new MoleculerError(`Multiple file upload not supported`, 400, 'BAD_REQUEST');
      }

      const extension = mime.extension(ctx.params.files[0].mimetype);
      const slug = extension ? `${uuidv4()}.${extension}}` : uuidv4();

      resourceUri = await ctx.call(controlledActions.post || 'ldp.container.post', {
        containerUri,
        slug,
        file: ctx.params.files[0],
        contentType: MIME_TYPES.JSON
      });
    }
    ctx.meta.$responseHeaders = {
      Location: resourceUri,
      Link: '<http://www.w3.org/ns/ldp#Resource>; rel="type"',
      'Content-Length': 0
    };
    // We need to set this also here (in addition to above) or we get a Moleculer warning
    ctx.meta.$location = resourceUri;
    ctx.meta.$statusCode = 201;
  } catch (e) {
    if (e.code < 400 && e.code >= 500) console.error(e);
    ctx.meta.$statusCode = e.code || 500;
    ctx.meta.$statusMessage = e.message;
  }
};
