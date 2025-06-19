import urlJoin from 'url-join';
import { sanitizeSparqlQuery } from '@semapps/triplestore';
import { defineAction } from 'moleculer';

const { MoleculerError } = require('moleculer').Errors;

export const action = defineAction({
  visibility: 'public',
  params: {
    groupSlug: { type: 'string', optional: true, min: 1, trim: true },
    groupUri: { type: 'string', optional: true, trim: true },
    webId: { type: 'string', optional: true },
    memberId: { type: 'string', optional: true }
  },
  async handler(ctx) {
    let { groupSlug, groupUri, memberId } = ctx.params;
    // @ts-expect-error TS(2339): Property 'webId' does not exist on type '{}'.
    const webId = ctx.params.webId || ctx.meta.webId || 'anon';

    if (!groupUri && !groupSlug) throw new MoleculerError('needs a groupSlug or a groupUri', 400, 'BAD_REQUEST');

    // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
    if (!groupUri) groupUri = urlJoin(this.settings.baseUrl, '_groups', groupSlug);

    // TODO: check that the group exists ?

    if (webId !== 'system') {
      // verifier que nous avons bien le droit Read sur le group.
      const groupRights = await ctx.call('webacl.resource.hasRights', {
        resourceUri: groupUri,
        rights: {
          read: true
        },
        webId
      });
      if (!groupRights.read) throw new MoleculerError(`Access denied to the group ${groupUri}`, 403, 'ACCESS_DENIED');
    }

    if (!memberId) memberId = webId;
    if (memberId === 'anon' || memberId === 'system') return false; // anonymous is never member.

    return await ctx.call('triplestore.query', {
      query: sanitizeSparqlQuery`
        PREFIX vcard: <http://www.w3.org/2006/vcard/ns#>
        ASK
        // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
        WHERE { GRAPH <${this.settings.graphName}> {
          <${groupUri}> vcard:hasMember <${memberId}> .
        } }
        `,
      webId: 'system'
    });
  }
});
