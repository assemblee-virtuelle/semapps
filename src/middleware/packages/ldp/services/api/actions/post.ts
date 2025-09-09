import { MIME_TYPES } from '@semapps/mime-types';
// @ts-expect-error TS(7016): Could not find a declaration file for module 'uuid... Remove this comment to see the full error message
import { v4 as uuidv4 } from 'uuid';
// @ts-expect-error TS(7016): Could not find a declaration file for module 'mime... Remove this comment to see the full error message
import mime from 'mime-types';
import { Errors } from 'moleculer';

const { MoleculerError } = Errors;

export default async function post(this: any, ctx: any) {
  try {
    let { username, slugParts, ...resource } = ctx.params;

    const containerUri = this.getUriFromSlugParts(slugParts, username);

    let resourceUri;
    const { controlledActions } = await ctx.call('ldp.registry.getByUri', { containerUri });
    if (ctx.meta.parser !== 'file') {
      const contentType = ctx.meta.headers['content-type'];

      // If the resource is Turtle or N-Triples, first convert it to JSON-LD
      if (contentType && contentType !== MIME_TYPES.JSON) {
        resource = await ctx.call('jsonld.parser.fromRDF', {
          input: ctx.meta.rawBody,
          options: { format: contentType }
        });
      }

      resourceUri = await ctx.call(controlledActions.post || 'ldp.container.post', {
        containerUri,
        slug: ctx.meta.headers.slug,
        resource
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
    // @ts-expect-error TS(18046): 'e' is of type 'unknown'.
    if (e.code < 400 && e.code >= 500) console.error(e);
    // @ts-expect-error TS(18046): 'e' is of type 'unknown'.
    ctx.meta.$statusCode = e.code || 500;
    // @ts-expect-error TS(18046): 'e' is of type 'unknown'.
    ctx.meta.$statusMessage = e.message;
  }
}
