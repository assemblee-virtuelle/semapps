// @ts-expect-error TS(7016): Could not find a declaration file for module 'spea... Remove this comment to see the full error message
import createSlug from 'speakingurl';
import urlJoin from 'url-join';
import { sanitizeSparqlQuery } from '@semapps/triplestore';
import { defineAction, Errors as MoleculerErrors } from 'moleculer';

const { MoleculerError } = MoleculerErrors;

export const api = async function api(this: any, ctx: any) {
  if (!ctx.meta.headers?.slug) throw new MoleculerError('needs a slug in your POST (json)', 400, 'BAD_REQUEST');
  if (this.settings.podProvider) ctx.meta.dataset = ctx.params.username;

  const { groupUri } = await ctx.call('webacl.group.create', {
    groupSlug: this.settings.podProvider ? `${ctx.params.username}/${ctx.meta.headers.slug}` : ctx.meta.headers.slug
  });

  ctx.meta.$responseHeaders = {
    Location: groupUri,
    'Content-Length': 0
  };
  // We need to set this also here (in addition to above) or we get a Moleculer warning
  ctx.meta.$location = groupUri;
  ctx.meta.$statusCode = 201;
};

export const action = defineAction({
  visibility: 'public',
  params: {
    groupUri: { type: 'string', optional: true },
    groupSlug: { type: 'string', optional: true, min: 1, trim: true },
    webId: { type: 'string', optional: true }
  },
  async handler(ctx) {
    let { groupUri, groupSlug } = ctx.params;
    // @ts-expect-error TS(2339): Property 'webId' does not exist on type '{}'.
    const webId = ctx.params.webId || ctx.meta.webId || 'anon';

    if (!groupUri) {
      groupSlug = createSlug(groupSlug, { lang: 'fr', custom: { '.': '.', '/': '/' } });
      // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
      groupUri = urlJoin(this.settings.baseUrl, '_groups', groupSlug);
    }

    // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
    if (await this.actions.exist({ groupUri, webId: 'system' }, { parentCtx: ctx })) {
      throw new MoleculerError('Group already exists', 400, 'BAD_REQUEST');
    }

    const newRights = {};
    if (webId === 'anon') {
      // @ts-expect-error TS(2339): Property 'anon' does not exist on type '{}'.
      newRights.anon = {
        read: true,
        write: true
      };
    } else if (webId === 'system') {
      // @ts-expect-error TS(2339): Property 'anon' does not exist on type '{}'.
      newRights.anon = {
        read: true
      };
    } else {
      // @ts-expect-error TS(2339): Property 'user' does not exist on type '{}'.
      newRights.user = {
        uri: webId,
        read: true,
        write: true,
        control: true
      };
    }
    await ctx.call('webacl.resource.addRights', {
      webId: 'system',
      resourceUri: groupUri,
      newRights
    });

    await ctx.call('triplestore.update', {
      query: sanitizeSparqlQuery`
        PREFIX vcard: <http://www.w3.org/2006/vcard/ns#>
        INSERT DATA { 
          GRAPH <${
            // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
            this.settings.graphName
          }> { 
            <${groupUri}> a vcard:Group 
          } 
        }
      `,
      webId: 'system'
    });

    return { groupUri };
  }
});
