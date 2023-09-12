const { MoleculerError } = require('moleculer').Errors;
const createSlug = require('speakingurl');
const urlJoin = require('url-join');
const { aclGroupExists, sanitizeSPARQL } = require('../../../utils');

module.exports = {
  api: async function api(ctx) {
    if (!ctx.params.slug) throw new MoleculerError('needs a slug in your POST (json)', 400, 'BAD_REQUEST');

    await ctx.call('webacl.group.create', {
      groupSlug: ctx.params.slug,
    });

    ctx.meta.$statusCode = 204;
  },
  action: {
    visibility: 'public',
    params: {
      groupUri: { type: 'string', optional: true },
      groupSlug: { type: 'string', optional: true, min: 1, trim: true },
      webId: { type: 'string', optional: true },
    },
    async handler(ctx) {
      let { groupUri, groupSlug } = ctx.params;
      const webId = ctx.params.webId || ctx.meta.webId || 'anon';

      if (!groupUri) {
        groupSlug = createSlug(groupSlug, { lang: 'fr', custom: { '.': '.', '/': '/' } });
        groupUri = urlJoin(this.settings.baseUrl, '_groups', groupSlug);
      }

      await sanitizeSPARQL(groupUri);

      if (await this.actions.exist({ groupUri, webId: 'system' }, { parentCtx: ctx })) {
        throw new MoleculerError('Group already exists', 400, 'BAD_REQUEST');
      }

      const newRights = {};
      if (webId === 'anon') {
        newRights.anon = {
          read: true,
          write: true,
        };
      } else if (webId === 'system') {
        newRights.anon = {
          read: true,
        };
      } else {
        newRights.user = {
          uri: webId,
          read: true,
          write: true,
          control: true,
        };
      }
      await ctx.call('webacl.resource.addRights', {
        webId: 'system',
        resourceUri: groupUri,
        newRights,
      });

      await ctx.call('triplestore.update', {
        query: `
          PREFIX vcard: <http://www.w3.org/2006/vcard/ns#>
          INSERT DATA { GRAPH <${this.settings.graphName}>
          { <${groupUri}> a vcard:Group } }`,
        webId: 'system',
      });

      // ctx.meta.$statusCode = 200;
      // ctx.meta.$responseType = 'application/json'
      return { groupUri };
    },
  },
};
