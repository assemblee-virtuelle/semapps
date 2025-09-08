import urlJoin from 'url-join';
import { sanitizeSparqlQuery } from '@semapps/triplestore';
import { ActionSchema } from 'moleculer';
import { removeAgentGroupOrAgentFromAuthorizations } from '../../../utils.ts';

import { Errors } from 'moleculer';

const { MoleculerError } = Errors;

export const api = async function api(this: any, ctx: any) {
  if (this.settings.podProvider) ctx.meta.dataset = ctx.params.username;
  await ctx.call('webacl.group.delete', {
    groupSlug: this.settings.podProvider ? `${ctx.params.username}/${ctx.params.id}` : ctx.params.id
  });

  ctx.meta.$statusCode = 204;
};

export const action = {
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

    // @ts-expect-error TS(2345): Argument of type 'TypeFromSchemaParam<{ type: "str... Remove this comment to see the full error message
    if (!groupUri) groupUri = urlJoin(this.settings.baseUrl, '_groups', groupSlug);

    // TODO: check that the group exists ?

    if (webId !== 'system') {
      const groupRights = await ctx.call('webacl.resource.hasRights', {
        resourceUri: groupUri,
        rights: {
          write: true
        },
        webId
      });
      if (!groupRights.write) throw new MoleculerError(`Access denied to the group ${groupUri}`, 403, 'ACCESS_DENIED');
    }

    await ctx.call('triplestore.update', {
      query: sanitizeSparqlQuery`
        DELETE WHERE { 
          GRAPH <${this.settings.graphName}> { 
            <${groupUri}> ?p ?o. 
          } 
        }
      `,
      webId: 'system'
    });

    await ctx.call('webacl.resource.deleteAllRights', { resourceUri: groupUri });

    await removeAgentGroupOrAgentFromAuthorizations(groupUri, true, this.settings.graphName, ctx);
  }
} satisfies ActionSchema;
