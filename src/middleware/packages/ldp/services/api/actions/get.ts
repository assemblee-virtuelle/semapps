import fs from 'fs';
import { Errors } from 'moleculer';
import { MIME_TYPES } from '@semapps/mime-types';
import { cleanUndefined, getDatasetFromUri, parseJson } from '../../../utils.ts';

const { MoleculerError } = Errors;

export default async function get(this: any, ctx: any) {
  try {
    let { username, slugParts, page } = ctx.params;

    const uri = this.getUriFromSlugParts(slugParts, username);
    ctx.meta.dataset = getDatasetFromUri(uri);

    const types = await ctx.call('ldp.resource.getTypes', { resourceUri: uri });

    let res;
    let links = [];

    if (types.includes('http://www.w3.org/ns/ldp#Container')) {
      /*
       * LDP CONTAINER
       */

      const { controlledActions } = await ctx.call('ldp.registry.getByUri', { containerUri: uri });

      let doNotIncludeResources = false;
      let maxPerPage: number | undefined;
      let sortPredicate: string | undefined;
      let sortOrder: string | undefined;

      // See https://www.w3.org/TR/ldp/#prefer-parameters
      if (ctx.meta.headers?.prefer) {
        doNotIncludeResources = ctx.meta.headers.prefer.includes(
          'include="http://www.w3.org/ns/ldp#PreferMinimalContainer"'
        );

        let regexResults = /max-member-count="(\d+)"/.exec(ctx.meta.headers.prefer);
        maxPerPage = regexResults?.[1] ? parseInt(regexResults[1]) : undefined;

        if (maxPerPage) {
          if (!page) {
            // If a paging is requested, but the page number is not provided, redirect to first page
            ctx.meta.$statusCode = 303;
            ctx.meta.$location = `${uri}?page=1`;
            ctx.meta.$responseHeaders = { 'Content-Length': 0 };
            return;
          } else {
            page = parseInt(page, 10);

            links.push({ uri: 'http://www.w3.org/ns/ldp#Page', rel: 'type' });
            links.push({ uri: `${uri}?page=1`, rel: 'first' });

            const resourcesUris = await ctx.call('ldp.container.getUris', { containerUri: uri });
            const numPages = Math.ceil(resourcesUris.length / maxPerPage);

            if (numPages > page) links.push({ uri: `${uri}?page=${page + 1}`, rel: 'next' });
            if (page > 1) links.push({ uri: `${uri}?page=${page - 1}`, rel: 'prev' });
            if (numPages > 1) links.push({ uri: `${uri}?page=${numPages}`, rel: 'last' });
          }
        }

        regexResults = /sort-predicate="([^"]+)"/.exec(ctx.meta.headers.prefer);
        sortPredicate = regexResults?.[1];

        regexResults = /sort-order="([ASC|asc|DESC|desc]+)"/.exec(ctx.meta.headers.prefer);
        sortOrder = regexResults?.[1] ? regexResults?.[1].toUpperCase() : 'ASC';
      }

      res = await ctx.call(
        controlledActions?.list || 'ldp.container.get',
        cleanUndefined({
          containerUri: uri,
          jsonContext: parseJson(ctx.meta.headers?.jsonldcontext),
          doNotIncludeResources,
          maxPerPage,
          page: maxPerPage ? page : undefined,
          sortPredicate,
          sortOrder
        })
      );

      if (doNotIncludeResources || maxPerPage || sortPredicate) {
        if (!ctx.meta.$responseHeaders) ctx.meta.$responseHeaders = {};
        ctx.meta.$responseHeaders['Preference-Applied'] = ctx.meta.headers.prefer;
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

      // If the resource is a file and no semantic encoding was requested, return it
      if (
        types.includes('http://semapps.org/ns/core#File') &&
        ![MIME_TYPES.JSON, MIME_TYPES.TURTLE, MIME_TYPES.TRIPLE].includes(ctx.meta.originalHeaders?.accept)
      ) {
        try {
          // Get the file as JSON-LD to get its metadata
          res = await ctx.call(controlledActions.get || 'ldp.resource.get', { resourceUri: uri });

          const file = fs.readFileSync(res['semapps:localPath']);
          ctx.meta.$responseType = res['semapps:mimeType'];
          // Since files are currently immutable, we set a maximum browser cache age
          // We do that after the file is read, otherwise the error 404 will be cached by the browser
          ctx.meta.$responseHeaders = {
            'Cache-Control': 'public, max-age=31536000',
            Vary: 'Accept'
          };
          return file;
        } catch (e) {
          throw new MoleculerError('File Not found', 404, 'NOT_FOUND');
        }
      } else {
        res = await ctx.call(
          controlledActions.get || 'ldp.resource.get',
          cleanUndefined({
            resourceUri: uri,
            jsonContext: parseJson(ctx.meta.headers?.jsonldcontext)
          })
        );
      }
    }

    if (ctx.meta.headers.accept && ctx.meta.headers.accept !== MIME_TYPES.JSON) {
      res = await ctx.call('jsonld.parser.toRDF', { input: res, options: { format: ctx.meta.headers.accept } });
    }

    if (!ctx.meta.$responseHeaders) ctx.meta.$responseHeaders = {};
    ctx.meta.$responseHeaders.Link = await ctx.call('ldp.link-header.get', { uri, additionalLinks: links });

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
