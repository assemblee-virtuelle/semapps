import { Errors } from 'moleculer';
import { MIME_TYPES } from '@semapps/mime-types';
import { cleanUndefined, getDatasetFromUri, parseJson } from '../../../utils.ts';
import { Binary } from '../../../types.ts';

const { MoleculerError } = Errors;

export default async function get(this: any, ctx: any) {
  try {
    const { username, slugParts } = ctx.params;

    const uri = this.getUriFromSlugParts(slugParts, username);
    ctx.meta.dataset = getDatasetFromUri(uri);

    const types = await ctx.call('ldp.resource.getTypes', { resourceUri: uri });

    let res;

    if (types.includes('http://www.w3.org/ns/ldp#Container')) {
      /*
       * LDP CONTAINER
       */

      const { controlledActions } = await ctx.call('ldp.registry.getByUri', { containerUri: uri });

      // See https://www.w3.org/TR/ldp/#prefer-parameters
      const doNotIncludeResources =
        ctx.meta.headers?.prefer === 'return=representation; include="http://www.w3.org/ns/ldp#PreferMinimalContainer"';

      res = await ctx.call(
        controlledActions?.list || 'ldp.container.get',
        cleanUndefined({
          containerUri: uri,
          jsonContext: parseJson(ctx.meta.headers?.jsonldcontext),
          doNotIncludeResources
        })
      );

      if (doNotIncludeResources) {
        if (!ctx.meta.$responseHeaders) ctx.meta.$responseHeaders = {};
        ctx.meta.$responseHeaders['Preference-Applied'] = 'return=representation';
      }
    } else if (
      types.includes('https://www.w3.org/ns/iana/media-types/application/octet-stream#Resource') &&
      ![MIME_TYPES.JSON, MIME_TYPES.TURTLE, MIME_TYPES.TRIPLE].includes(ctx.meta.originalHeaders?.accept)
    ) {
      /*
       * LDP BINARY
       */

      try {
        const binary: Binary = await ctx.call('ldp.binary.get', { resourceUri: uri });

        ctx.meta.$responseType = binary.mimeType;
        // Since files are currently immutable, we set a maximum browser cache age
        // We do that after the file is read, otherwise the error 404 will be cached by the browser
        ctx.meta.$responseHeaders = {
          'Cache-Control': 'public, max-age=31536000',
          Vary: 'Accept'
        };

        return binary.file;
      } catch (e) {
        throw new MoleculerError('File Not found', 404, 'NOT_FOUND');
      }
    } else {
      /*
       * LDP RESOURCE
       */

      const { controlledActions, preferredView } = await ctx.call('ldp.registry.getByUri', { resourceUri: uri });

      if (ctx.meta.originalHeaders?.accept?.includes('text/html') && this.settings.preferredViewForResource) {
        const webId = ctx.meta.webId || 'anon';
        const resourceExist = await ctx.call('ldp.resource.exist', { resourceUri: uri, webId });
        if (resourceExist) {
          const redirect = await this.settings.preferredViewForResource.bind(this)(uri, preferredView);
          if (redirect && redirect !== uri) {
            ctx.meta.$statusCode = 302;
            ctx.meta.$location = redirect;
            ctx.meta.$responseHeaders = {
              'Content-Length': 0
            };
            return;
          }
        }
      }

      res = await ctx.call(
        controlledActions.get || 'ldp.resource.get',
        cleanUndefined({
          resourceUri: uri,
          jsonContext: parseJson(ctx.meta.headers?.jsonldcontext)
        })
      );
    }

    if (ctx.meta.headers.accept && ctx.meta.headers.accept !== MIME_TYPES.JSON) {
      res = await ctx.call('jsonld.parser.toRDF', { input: res, options: { format: ctx.meta.headers.accept } });
    }

    if (!ctx.meta.$responseHeaders) ctx.meta.$responseHeaders = {};
    ctx.meta.$responseHeaders.Link = await ctx.call('ldp.link-header.get', { uri });

    // Hack to make our servers work with Mastodon servers, which expect a special profile
    if (ctx.meta.$responseType === 'application/ld+json')
      ctx.meta.$responseType = `application/ld+json; profile="https://www.w3.org/ns/activitystreams"`;

    ctx.meta.$responseType = ctx.meta.$responseType || ctx.meta.headers.accept;

    return res;
  } catch (e) {
    // @ts-expect-error TS(18046): 'e' is of type 'unknown'.
    if (!e.code || (e.code < 400 && e.code >= 500)) console.error(e);
    // @ts-expect-error TS(18046): 'e' is of type 'unknown'.
    ctx.meta.$statusCode = e.code || 500;
    // @ts-expect-error TS(18046): 'e' is of type 'unknown'.
    ctx.meta.$statusMessage = e.message;
  }
}
