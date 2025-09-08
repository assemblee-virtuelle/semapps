import createSlug from 'speakingurl';
import urlJoin from 'url-join';
import { sanitizeSparqlQuery } from '@semapps/triplestore';
import { ActionSchema } from 'moleculer';

const { MoleculerError } = require('moleculer').Errors;

export const api = async function api(ctx) {
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

export const action = {
  visibility: 'public',
  params: {
    groupUri: { type: 'string', optional: true },
    groupSlug: { type: 'string', optional: true, min: 1, trim: true },
    webId: { type: 'string', optional: true }
  },
  async handler(ctx) {
    let { groupUri, groupSlug } = ctx.params;
    const webId = ctx.params.webId || ctx.meta.webId || 'anon';

    if (!groupUri) {
      groupSlug = createSlug(groupSlug, { lang: 'fr', custom: { '.': '.', '/': '/' } });
      groupUri = urlJoin(this.settings.baseUrl, '_groups', groupSlug);
    }

    if (await this.actions.exist({ groupUri, webId: 'system' }, { parentCtx: ctx })) {
      throw new MoleculerError('Group already exists', 400, 'BAD_REQUEST');
    }

    const newRights = {};
    if (webId === 'anon') {
      newRights.anon = {
        read: true,
        write: true
      };
    } else if (webId === 'system') {
      newRights.anon = {
        read: true
      };
    } else {
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
          GRAPH <${this.settings.graphName}> { 
            <${groupUri}> a vcard:Group 
          } 
        }
      `,
      webId: 'system'
    });

    return { groupUri };
  }
} satisfies ActionSchema;
