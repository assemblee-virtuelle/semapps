const { MoleculerError } = require('moleculer').Errors;
const createSlug = require('speakingurl');
const urlJoin = require('url-join');
const { 
  aclGroupExists
} = require('../../../utils');


module.exports = {
  api: async function api(ctx) {

    if (!ctx.params.slug) throw new MoleculerError('needs a slug in your POST (json)', 400, 'BAD_REQUEST');

    await ctx.call('webacl.group.create', {
      slug: ctx.params.slug
    });

    ctx.meta.$statusCode = 204;

  },
  action: {
    visibility: 'public',
    params: {
      slug: { type: 'string', optional: false, min:1, trim:true },
      webId: { type: 'string', optional: true}
    },
    async handler(ctx) {

      let webId = ctx.params.webId || ctx.meta.webId || 'anon';
      
      let slug = ctx.params.slug;
      slug = createSlug(slug, { lang: 'fr', custom: { '.': '.' } });

      let groupUri = urlJoin(this.settings.baseUrl,'_group',slug);

      // checks that it doesnt exist yet
      if (await aclGroupExists(groupUri, ctx, this.settings.graphName)) 
        throw new MoleculerError('group already exists', 400, 'BAD_REQUEST');

      let newRights = {}
      if (webId == 'anon') {
        newRights.anon = {
          read: true,
          write: true
        }
      } else {
        newRights.user = {
          uri: webId,
          read: true,
          write: true,
          control: true
        }
      }
      await ctx.call('webacl.resource.addRights', {
        webId: 'system',
        resourceUri: groupUri,
        newRights
      });

      await ctx.call('triplestore.update',{
        query: `
          PREFIX vcard: <http://www.w3.org/2006/vcard/ns#>
          INSERT DATA { GRAPH ${this.settings.graphName}
          { <${groupUri}> a vcard:Group } }`,
        webId: 'system',
      })

      // ctx.meta.$statusCode = 200;
      // ctx.meta.$responseType = 'application/json'
      return {
        groupUri
      }

    }
  }
};
