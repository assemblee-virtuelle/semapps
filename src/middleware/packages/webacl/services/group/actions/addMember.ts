import { sanitizeSparqlQuery } from '@semapps/triplestore';
import urlJoin from 'url-join';
import { defineAction } from 'moleculer';

import { Errors as MoleculerErrors } from 'moleculer';
const { MoleculerError } = MoleculerErrors;

export const api = async function api(this: any, ctx: any) {
  if (!ctx.params.memberUri) throw new MoleculerError('needs a memberUri in your PATCH (json)', 400, 'BAD_REQUEST');
  if (this.settings.podProvider) ctx.meta.dataset = ctx.params.username;

  await ctx.call('webacl.group.addMember', {
    groupSlug: this.settings.podProvider ? `${ctx.params.username}/${ctx.params.id}` : ctx.params.id,
    memberUri: ctx.params.memberUri
  });

  ctx.meta.$statusCode = 204;
};

export const action = defineAction({
  visibility: 'public',
  params: {
    groupSlug: { type: 'string', optional: true, min: 1, trim: true },
    groupUri: { type: 'string', optional: true, trim: true },
    memberUri: { type: 'string', optional: false, trim: true },
    webId: { type: 'string', optional: true }
  },
  async handler(ctx) {
    let { groupSlug, groupUri, memberUri } = ctx.params;
    // @ts-expect-error TS(2339): Property 'webId' does not exist on type '{}'.
    const webId = ctx.params.webId || ctx.meta.webId || 'anon';

    if (!groupUri && !groupSlug) throw new MoleculerError('needs a groupSlug or a groupUri', 400, 'BAD_REQUEST');

    // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
    if (!groupUri) groupUri = urlJoin(this.settings.baseUrl, '_groups', groupSlug);

    // TODO: check that the member exists ?

    // Check we have Append ou Write permissions on the group
    if (webId !== 'system') {
      const groupRights = await ctx.call('webacl.resource.hasRights', {
        resourceUri: groupUri,
        rights: {
          append: true,
          write: true
        },
        webId
      });
      if (!groupRights.append && !groupRights.write)
        throw new MoleculerError(`Access denied to the group ${groupUri}`, 403, 'ACCESS_DENIED');
    }

    await ctx.call('triplestore.update', {
      query: sanitizeSparqlQuery`
        PREFIX vcard: <http://www.w3.org/2006/vcard/ns#>
        INSERT DATA { 
          // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
          GRAPH <${this.settings.graphName}> { 
            <${groupUri}> vcard:hasMember <${memberUri}> 
          }
        }
      `,
      webId: 'system'
    });

    ctx.emit('webacl.group.member-added', { groupUri, memberUri }, { meta: { webId: null, dataset: null } });
  }
});
