import urlJoin from 'url-join';
import { sanitizeSparqlQuery } from '@semapps/triplestore';
import { defineAction } from 'moleculer';

const { MoleculerError } = require('moleculer').Errors;

export const action = defineAction({
  visibility: 'public',
  params: {
    groupSlug: { type: 'string', optional: true, min: 1, trim: true },
    groupUri: { type: 'string', optional: true, trim: true },
    webId: { type: 'string', optional: true }
  },
  async handler(ctx) {
    let { groupUri, groupSlug } = ctx.params;
    // @ts-expect-error TS(2339): Property 'webId' does not exist on type '{}'.
    const webId = ctx.params.webId || ctx.meta.webId;

    if (!groupUri && !groupSlug) throw new MoleculerError('needs a groupSlug or a groupUri', 400, 'BAD_REQUEST');
    // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
    if (!groupUri) groupUri = urlJoin(this.settings.baseUrl, '_groups', groupSlug);

    return await ctx.call('triplestore.query', {
      query: sanitizeSparqlQuery`
        PREFIX vcard: <http://www.w3.org/2006/vcard/ns#>
        ASK WHERE { 
          // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
          GRAPH <${this.settings.graphName}> {
            <${groupUri}> a vcard:Group .
          } 
        }
      `,
      webId
    });
  }
});
