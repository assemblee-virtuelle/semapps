import { ActionSchema } from 'moleculer';
import { getContainerFromUri } from '../../../utils.ts';

const Schema = {
  visibility: 'public',
  params: {
    resourceUri: 'string',
    dataset: { type: 'string', optional: true }
  },
  async handler(ctx) {
    const { resourceUri } = ctx.params;
    const dataset = ctx.params.dataset || ctx.meta.dataset;

    // In the POD provider config, the root container with actors is not a real LDP container
    // Because we have chosen not to use a common dataset for this kind of data
    // So we use the deprecated getContainerFromUri to find the container
    // TODO store actors in a proper LDP container, with its own dataset ?
    if (this.settings.podProvider && `${getContainerFromUri(resourceUri)}/` === this.settings.baseUrl) {
      return [getContainerFromUri(resourceUri)];
    }

    const result = await ctx.call('triplestore.query', {
      query: `
        PREFIX ldp: <http://www.w3.org/ns/ldp#>
        SELECT ?containerUri
        WHERE {
          GRAPH ?containerUri {
            ?containerUri ldp:contains <${resourceUri}> .
          }
        }
      `,
      dataset,
      webId: 'system'
    });

    return result.map((node: any) => node.containerUri.value);
  }
} satisfies ActionSchema;

export default Schema;
