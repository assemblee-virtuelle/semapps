import urlJoin from 'url-join';
import { sanitizeSparqlQuery } from '@semapps/triplestore';
import { ActionSchema } from 'moleculer';

const { MoleculerError } = require('moleculer').Errors;

export const action = {
  visibility: 'public',
  params: {
    // @ts-expect-error TS(2353): Object literal may only specify known properties, ... Remove this comment to see the full error message
    groupSlug: { type: 'string', optional: true, min: 1, trim: true },
    // @ts-expect-error TS(2353): Object literal may only specify known properties, ... Remove this comment to see the full error message
    groupUri: { type: 'string', optional: true, trim: true }
  },
  async handler(ctx) {
    let { groupUri, groupSlug } = ctx.params;

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
      webId: 'system'
    });
  }
} satisfies ActionSchema;
