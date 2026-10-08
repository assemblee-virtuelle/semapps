import type { ActionSchema } from 'moleculer';
import resourcesFiltersParams from '../resources-filters-params.ts';

/**
 * Count the resources of a container, with the same filters and permissions as ldp.container.get
 * (used to compute the number of pages)
 */
const Schema = {
  visibility: 'public',
  params: {
    containerUri: { type: 'string' },
    webId: { type: 'string', optional: true },
    ...resourcesFiltersParams
  },
  async handler(ctx) {
    const { containerUri } = ctx.params;
    const webId = ctx.params.webId || ctx.meta.webId || 'anon';

    const results: any = await ctx.call('triplestore.query', {
      query: `
        SELECT (COUNT(DISTINCT ?s1) AS ?count)
        WHERE {
          <${containerUri}> <http://www.w3.org/ns/ldp#contains> ?s1 .
          ${await this.buildResourcesFiltersQuery(ctx)}
        }
      `,
      webId
    });

    return parseInt(results[0].count.value, 10);
  }
} satisfies ActionSchema;

export default Schema;
