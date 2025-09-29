import { MIME_TYPES } from '@semapps/mime-types';
import { Errors } from 'moleculer';

const { MoleculerError } = Errors;

export default async function post(this: any, ctx: any) {
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
    // @ts-expect-error TS(18046): 'e' is of type 'unknown'.
    if (!e.code || (e.code < 400 && e.code >= 500)) console.error(e);
    // @ts-expect-error TS(18046): 'e' is of type 'unknown'.
    ctx.meta.$statusCode = e.code || 500;
    // @ts-expect-error TS(18046): 'e' is of type 'unknown'.
    ctx.meta.$statusMessage = e.message;
  }
}
