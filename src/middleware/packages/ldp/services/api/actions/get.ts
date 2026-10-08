import fs from 'fs';
import { MIME_TYPES } from '@semapps/mime-types';
import { cleanUndefined, parseJson } from '../../../utils.ts';

import moleculer from 'moleculer';
const { Errors } = moleculer;

const { MoleculerError } = Errors;

export default async function get(this: any, ctx: any) {
  try {
    const { username, slugParts } = ctx.params;
    let { page } = ctx.params;

    const uri = this.getUriFromSlugParts(slugParts, username);
    const types = await ctx.call('ldp.resource.getTypes', { resourceUri: uri });

    let res;
    const links = [];

    if (types.includes('http://www.w3.org/ns/ldp#Container')) {
      /*
       * LDP CONTAINER
       */

      const { accept, controlledActions } = {
        ...(await ctx.call('ldp.registry.getByUri', { containerUri: uri })),
        ...ctx.meta.headers
      };

      // Filters passed through the query string. They are kept in the paging links.
      const { q: search, 'q-predicate': searchPredicates, near: nearParam, radius: radiusParam } = ctx.params;
      const filtersQueryString = new URLSearchParams();
      if (search !== undefined) {
        if (typeof search !== 'string') throw new MoleculerError('Invalid q param', 400, 'BAD_REQUEST');
        filtersQueryString.append('q', search);
      }
      for (const predicate of searchPredicates ? [].concat(searchPredicates) : []) {
        if (typeof predicate !== 'string') throw new MoleculerError('Invalid q-predicate param', 400, 'BAD_REQUEST');
        filtersQueryString.append('q-predicate', predicate);
      }
      let near: { latitude: number; longitude: number; radius: number } | undefined;
      if (nearParam !== undefined || radiusParam !== undefined) {
        const [latitude, longitude] = typeof nearParam === 'string' ? nearParam.split(',').map(Number) : [];
        const radius = typeof radiusParam === 'string' ? Number(radiusParam) : NaN;
        if (![latitude, longitude, radius].every(Number.isFinite)) {
          throw new MoleculerError(
            'The near (latitude,longitude) and radius (km) params are required',
            400,
            'BAD_REQUEST'
          );
        }
        near = { latitude, longitude, radius };
        filtersQueryString.append('near', nearParam);
        filtersQueryString.append('radius', radiusParam);
      }
      const filtersParams = cleanUndefined({
        search: search || undefined,
        searchPredicates: search && searchPredicates ? [].concat(searchPredicates) : undefined,
        near
      });
      const pageUri = (pageNumber: number) => {
        const queryString = new URLSearchParams(filtersQueryString);
        queryString.append('page', `${pageNumber}`);
        return `${uri}?${queryString.toString()}`;
      };

      let doNotIncludeResources = false;
      let maxPerPage: number | undefined;
      let sortPredicate: string | undefined;
      let sortOrder: string | undefined;

      // See https://www.w3.org/TR/ldp/#prefer-parameters and https://www.w3.org/TR/ldp-paging/
      const prefer: string | undefined = ctx.meta.headers?.prefer;
      if (prefer) {
        doNotIncludeResources = prefer.includes('include="http://www.w3.org/ns/ldp#PreferMinimalContainer"');

        let regexResults = /max-member-count="(\d+)"/.exec(prefer);
        maxPerPage = regexResults?.[1] ? parseInt(regexResults[1], 10) || undefined : undefined;

        regexResults = /sort-predicate="([^"]+)"/.exec(prefer);
        sortPredicate = regexResults?.[1];

        regexResults = /sort-order="(ASC|asc|DESC|desc)"/.exec(prefer);
        sortOrder = regexResults?.[1] ? regexResults[1].toUpperCase() : 'ASC';

        if (maxPerPage) {
          if (!page) {
            // If paging is requested but no page number is provided, redirect to the first page
            ctx.meta.$statusCode = 303;
            ctx.meta.$location = pageUri(1);
            ctx.meta.$responseHeaders = { 'Content-Length': 0 };
            return;
          }

          page = parseInt(page, 10);
          if (!(page >= 1)) throw new MoleculerError('Invalid page number', 400, 'BAD_REQUEST');

          const count = await ctx.call('ldp.container.count', { containerUri: uri, ...filtersParams });
          const numPages = Math.ceil(count / maxPerPage);

          links.push({ uri: 'http://www.w3.org/ns/ldp#Page', rel: 'type' });
          links.push({ uri: pageUri(1), rel: 'first' });
          if (numPages > page) links.push({ uri: pageUri(page + 1), rel: 'next' });
          if (page > 1) links.push({ uri: pageUri(page - 1), rel: 'prev' });
          if (numPages > 1) links.push({ uri: pageUri(numPages), rel: 'last' });
        }
      }

      res = await ctx.call(
        controlledActions?.list || 'ldp.container.get',
        cleanUndefined({
          containerUri: uri,
          accept,
          jsonContext: parseJson(ctx.meta.headers?.jsonldcontext),
          doNotIncludeResources,
          ...filtersParams,
          maxPerPage,
          page: maxPerPage ? page : undefined,
          sortPredicate,
          sortOrder: sortPredicate ? sortOrder : undefined
        })
      );

      if (doNotIncludeResources || maxPerPage || sortPredicate) {
        if (!ctx.meta.$responseHeaders) ctx.meta.$responseHeaders = {};
        ctx.meta.$responseHeaders['Preference-Applied'] = prefer;
      }

      ctx.meta.$responseType = ctx.meta.$responseType || accept;
    } else {
      /*
       * LDP RESOURCE
       */
      const { accept, controlledActions, preferredView } = {
        ...(await ctx.call('ldp.registry.getByUri', { resourceUri: uri })),
        ...ctx.meta.headers
      };

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
        ![MIME_TYPES.JSON, MIME_TYPES.TURTLE].includes(ctx.meta.originalHeaders?.accept)
      ) {
        try {
          // Get the file as JSON to get its metadata
          res = await ctx.call(controlledActions.get || 'ldp.resource.get', {
            resourceUri: uri,
            accept: MIME_TYPES.JSON
          });

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
            accept,
            jsonContext: parseJson(ctx.meta.headers?.jsonldcontext)
          })
        );

        ctx.meta.$responseType = ctx.meta.$responseType || accept;
      }
    }

    if (!ctx.meta.$responseHeaders) ctx.meta.$responseHeaders = {};
    ctx.meta.$responseHeaders.Link = await ctx.call('ldp.link-header.get', { uri, additionalLinks: links });

    // Hack to make our servers work with Mastodon servers, which except a special profile
    if (ctx.meta.$responseType === 'application/ld+json')
      ctx.meta.$responseType = `application/ld+json; profile="https://www.w3.org/ns/activitystreams"`;

    return res;
  } catch (e) {
    // @ts-expect-error TS(18046): 'e' is of type 'unknown'.
    if (e.code !== 404 && e.code !== 403) console.error(e);
    // @ts-expect-error TS(18046): 'e' is of type 'unknown'.
    ctx.meta.$statusCode = e.code || 500;
    // @ts-expect-error TS(18046): 'e' is of type 'unknown'.
    ctx.meta.$statusMessage = e.message;
  }
}
