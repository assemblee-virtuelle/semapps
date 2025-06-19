import urlJoin from 'url-join';
import { sanitizeSparqlQuery } from '@semapps/triplestore';
import { defineAction } from 'moleculer';

import { Errors as MoleculerErrors } from 'moleculer';
const { MoleculerError } = MoleculerErrors;

export const api = async function api(this: any, ctx: any) {
  if (this.settings.podProvider) ctx.meta.dataset = ctx.params.username;
  return await ctx.call('webacl.group.getMembers', {
    groupSlug: this.settings.podProvider ? `${ctx.params.username}/${ctx.params.id}` : ctx.params.id
  });
};

export const action = defineAction({
  visibility: 'public',
  params: {
    groupSlug: { type: 'string', optional: true, min: 1, trim: true },
    groupUri: { type: 'string', optional: true, trim: true },
    webId: { type: 'string', optional: true }
  },
  async handler(ctx) {
    let { groupSlug, groupUri } = ctx.params;
    // @ts-expect-error TS(2339): Property 'webId' does not exist on type '{}'.
    const webId = ctx.params.webId || ctx.meta.webId || 'anon';

    if (!groupUri && !groupSlug) throw new MoleculerError('needs a groupSlug or a groupUri', 400, 'BAD_REQUEST');

    // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
    if (!groupUri) groupUri = urlJoin(this.settings.baseUrl, '_groups', groupSlug);

    // TODO: check that the group exists ?

    if (webId !== 'system') {
      const groupRights = await ctx.call('webacl.resource.hasRights', {
        resourceUri: groupUri,
        rights: {
          read: true
        },
        webId
      });
      if (!groupRights.read) throw new MoleculerError(`Access denied to the group ${groupUri}`, 403, 'ACCESS_DENIED');
    }

    const members = await ctx.call('triplestore.query', {
      query: sanitizeSparqlQuery`
        PREFIX vcard: <http://www.w3.org/2006/vcard/ns#>
        SELECT ?m 
        WHERE { 
          // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
          GRAPH <${this.settings.graphName}> { 
            <${groupUri}> vcard:hasMember ?m 
          } 
        }
      `,
      webId: 'system'
    });

    return members.map((m: any) => m.m.value);
  }
});
