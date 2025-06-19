import { MIME_TYPES } from '@semapps/mime-types';
import { defineAction } from 'moleculer';
import { getContainerFromUri } from '../../../utils.ts';

const Schema = defineAction({
  visibility: 'public',
  params: {
    // @ts-expect-error TS(2769): No overload matches this call.
    resourceUri: 'string',
    dataset: { type: 'string', optional: true }
  },
  async handler(ctx) {
    const { resourceUri } = ctx.params;
    // @ts-expect-error TS(2339): Property 'dataset' does not exist on type '{}'.
    const dataset = ctx.params.dataset || ctx.meta.dataset;

    // In the POD provider config, the root container with actors is not a real LDP container
    // Because we have chosen not to use a common dataset for this kind of data
    // So we use the deprecated getContainerFromUri to find the container
    // TODO store actors in a proper LDP container, with its own dataset ?
    // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
    if (this.settings.podProvider && `${getContainerFromUri(resourceUri)}/` === this.settings.baseUrl) {
      return [getContainerFromUri(resourceUri)];
    }

    const result = await ctx.call('triplestore.query', {
      query: `
        PREFIX ldp: <http://www.w3.org/ns/ldp#>
        SELECT ?containerUri
        WHERE {
          ?containerUri ldp:contains <${resourceUri}> .
        }
      `,
      accept: MIME_TYPES.JSON,
      dataset,
      webId: 'system'
    });

    return result.map((node: any) => node.containerUri.value);
  }
});

export default Schema;
