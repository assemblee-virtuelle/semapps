const { MoleculerError } = require('moleculer').Errors;
const { MIME_TYPES } = require('@semapps/mime-types');
const { 
  getAclUriFromResourceUri,
  convertBodyToTriples,
  filterTriplesForResource,
} = require('../../../utils');
const urlJoin = require('url-join');

module.exports = {
  api: async function api(ctx) {
    const contentType = ctx.meta.headers['content-type'];
    if (!contentType || ( contentType!= MIME_TYPES.JSON && contentType!= MIME_TYPES.TURTLE) )
      throw new MoleculerError('Content type not supported : ' + contentType, 400, 'BAD_REQUEST')

    let addedRights = await convertBodyToTriples(ctx.meta.body, contentType)

    if (addedRights.length == 0) throw new MoleculerError('Nothing to add', 400, 'BAD_REQUEST');

    await ctx.call('webacl.resource.addRights', {
      slugParts: ctx.params.slugParts,
      addedRights
    });

    ctx.meta.$statusCode = 204;

  },
  action: {
    visibility: 'public',
    params: {
      resourceUri: { type: 'string', optional: true },
      slugParts: { type: "array", items: "string", optional: true },
      webId: { type: 'string', optional: true },
      // addedRights is an array of objects of the form { auth: 'http://localhost:3000/_acl/container29#Control',  p: 'http://www.w3.org/ns/auth/acl#agent',  o: 'https://data.virtual-assembly.org/users/sebastien.rosset' }
      addedRights: { type: 'array', optional: false, min:1 },
    },
    async handler(ctx) {
      let { slugParts, webId, addedRights, resourceUri } = ctx.params;
      webId = webId || ctx.meta.webId || 'anon';

      if (!slugParts || slugParts.length == 0) {
        // this is the root container.
        slugParts = ['/'] ;
      }
      resourceUri = resourceUri || urlJoin(this.settings.baseUrl, ...slugParts);
      let isContainer = await this.checkResourceOrContainerExists(ctx, resourceUri);

      // check that the user has Control perm.
      // TODO: bypass this check if user is 'system' (use system as a super-admin) ?
      let {control} = await ctx.call('webacl.resource.hasRights', {
        resourceUri,
        rights : { control:true },
        webId
      });
      if (!control) throw new MoleculerError('Access denied ! user must have Control permission', 403, 'ACCESS_DENIED');

      // filter out all the addedRights that are not for the resource
      let aclUri = getAclUriFromResourceUri(this.settings.baseUrl,resourceUri)
      addedRights = addedRights.filter(a => filterTriplesForResource(a, aclUri, isContainer));

      if (addedRights.length == 0) throw new MoleculerError('The rights cannot be added because they are incorrect', 400, 'BAD_REQUEST');

      //console.log(addedRights)

      let currentPerms = await this.getExistingPerms(ctx, resourceUri, this.settings.baseUrl, this.settings.graphName, isContainer);

      //console.log(currentPerms)

      // find the difference between addedRights and currentPerms. add only what is not existant yet.
      let difference = addedRights.filter(x => !currentPerms.some(y => x.auth == y.auth && x.o == y.o && x.p == y.p));

      //console.log(difference)
      if (difference.length == 0) return;

      // compile a list of Authorization already present. if some of them don't exist, we need to create them
      let currentAuths = this.compileAuthorizationNodesMap(currentPerms);

      let addRequest = ''
      for (const add of difference) {
        if (!currentAuths[add.auth]) {
          addRequest += this.generateNewAuthNode(add.auth);
          currentAuths[add.auth] = true;
        }
        addRequest += `<${add.auth}> <${add.p}> <${add.o}>.\n`;
      }

      //console.log(addRequest)

      await ctx.call('triplestore.insert',{
        resource: addRequest,
        webId: 'system',
        graphName: this.settings.graphName
      })

    }   
  }
};
