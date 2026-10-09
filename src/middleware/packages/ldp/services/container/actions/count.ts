import type { ActionSchema } from 'moleculer';
import resourcesFiltersParams from '../resources-filters-params.ts';

/**
 * Count the resources of a container, with the same filters as ldp.container.get (used to compute the number of pages).
 * Like ldp.container.get, permissions are not checked by the query (see there), so resources that the user can't
 * read are counted too.
 */
const Schema = {
  visibility: 'public',
  params: {
    containerUri: { type: 'string' },
    // Not used anymore, kept for compatibility
    webId: { type: 'string', optional: true },
    ...resourcesFiltersParams
  },
  async handler(ctx) {
    const { containerUri } = ctx.params;

    const results: any = await ctx.call('triplestore.query', {
      query: `
        SELECT (COUNT(DISTINCT ?s1) AS ?count)
        WHERE {
          <${containerUri}> <http://www.w3.org/ns/ldp#contains> ?s1 .
          ${await this.buildResourcesFiltersQuery(ctx)}
        }
      `,
      webId: 'system'
    });

    return parseInt(results[0].count.value, 10);
  }
} satisfies ActionSchema;

export default Schema;
