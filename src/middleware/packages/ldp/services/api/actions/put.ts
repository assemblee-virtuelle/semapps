import { MIME_TYPES } from '@semapps/mime-types';

const { MoleculerError } = require('moleculer').Errors;

export default async function post(ctx) {
  let { username, slugParts, ...resource } = ctx.params;

  const resourceUri = this.getUriFromSlugParts(slugParts, username);
  const resourceId = resource['@id'] || resource.id;

  if (!resourceId) {
    resource['@id'] = resourceUri;
  } else if (resourceUri !== resourceId) {
    throw new MoleculerError(`The @id of the resource is not the same as its URL`, 400, 'BAD_REQUEST');
  }

  const { controlledActions } = await ctx.call('ldp.registry.getByUri', { resourceUri });

  if (ctx.meta.parser === 'file') {
    throw new MoleculerError(`PUT method is not supported for non-RDF resources`, 400, 'BAD_REQUEST');
  }

  try {
    const contentType = ctx.meta.headers['content-type'];

    // If the body is in Turtle or N-Triples, first convert it to JSON-LD
    if (contentType && contentType !== MIME_TYPES.JSON) {
      resource = await ctx.call('jsonld.parser.fromRDF', { input: ctx.meta.rawBody, options: { format: contentType } });
    }

    await ctx.call(controlledActions.put || 'ldp.resource.put', { resource });

    ctx.meta.$statusCode = 204;
    ctx.meta.$responseHeaders = {
      Link: '<http://www.w3.org/ns/ldp#Resource>; rel="type"',
      'Content-Length': 0
    };
  } catch (e) {
    if (e.code !== 404 && e.code !== 403) console.error(e);
    ctx.meta.$statusCode = e.code || 500;
    ctx.meta.$statusMessage = e.message;
  }
}
