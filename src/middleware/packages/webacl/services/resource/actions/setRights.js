const { MoleculerError } = require('moleculer').Errors;
const { MIME_TYPES } = require('@semapps/mime-types');
const { getAclUriFromResourceUri, convertBodyToTriples, filterTriplesForResource } = require('../../../utils');
const urlJoin = require('url-join');

module.exports = {
  api: async function api(ctx) {
    const contentType = ctx.meta.headers['content-type'];
    let slugParts = ctx.params.slugParts;

    if (!contentType || (contentType !== MIME_TYPES.JSON && contentType !== MIME_TYPES.TURTLE))
      throw new MoleculerError('Content type not supported : ' + contentType, 400, 'BAD_REQUEST');

    let newRights = await convertBodyToTriples(ctx.meta.body, contentType);
    if (newRights.length === 0) throw new MoleculerError('PUT rights cannot be empty', 400, 'BAD_REQUEST');

    // This is the root container
    if (!slugParts || slugParts.length === 0) slugParts = ['/'];

    await ctx.call('webacl.resource.setRights', {
      resourceUri: urlJoin(this.settings.baseUrl, ...slugParts),
      newRights
    });

    ctx.meta.$statusCode = 204;
  },
  action: {
    visibility: 'public',
    params: {
      resourceUri: { type: 'string' },
      webId: { type: 'string', optional: true },
      // newRights is an array of objects of the form { auth: 'http://localhost:3000/_acl/container29#Control',  p: 'http://www.w3.org/ns/auth/acl#agent',  o: 'https://data.virtual-assembly.org/users/sebastien.rosset' }
      newRights: { type: 'array', optional: false, min: 1 }
      // minimum is one right : We cannot leave a resource without rights.
    },
    async handler(ctx) {
      let { webId, newRights, resourceUri } = ctx.params;
      webId = webId || ctx.meta.webId || 'anon';

      let isContainer = await this.checkResourceOrContainerExists(ctx, resourceUri);

      // check that the user has Control perm.
      // TODO: bypass this check if user is 'system' (use system as a super-admin) ?
      let { control } = await ctx.call('webacl.resource.hasRights', {
        resourceUri,
        rights: { control: true },
        webId
      });
      if (!control) throw new MoleculerError('Access denied ! user must have Control permission', 403, 'ACCESS_DENIED');

      // filter out all the newRights that are not for the resource
      let aclUri = getAclUriFromResourceUri(this.settings.baseUrl, resourceUri);
      newRights = newRights.filter(a => filterTriplesForResource(a, aclUri, isContainer));

      if (newRights.length === 0)
        throw new MoleculerError('The rights cannot be changed because they are incorrect', 400, 'BAD_REQUEST');

      let currentPerms = await this.getExistingPerms(
        ctx,
        resourceUri,
        this.settings.baseUrl,
        this.settings.graphName,
        isContainer
      );

      // find the difference between newRights and currentPerms. add only what is not existant yet. and remove those that are not needed anymore
      let differenceAdd = newRights.filter(
        x => !currentPerms.some(y => x.auth === y.auth && x.o === y.o && x.p === y.p)
      );
      let differenceDelete = currentPerms.filter(
        x => !newRights.some(y => x.auth === y.auth && x.o === y.o && x.p === y.p)
      );

      if (differenceAdd.length === 0 && differenceDelete.length === 0) return;

      // compile a list of Authorization already present. because if some of them don't exist, we need to create them
      let currentAuths = this.compileAuthorizationNodesMap(currentPerms);

      let addRequest = '';
      for (const add of differenceAdd) {
        if (!currentAuths[add.auth]) {
          addRequest += this.generateNewAuthNode(add.auth);
          currentAuths[add.auth] = 1;
        } else {
          currentAuths[add.auth] += 1;
        }
        addRequest += `<${add.auth}> <${add.p}> <${add.o}>.\n`;
      }

      let deleteRequest = '';
      for (const del of differenceDelete) {
        deleteRequest += `<${del.auth}> <${del.p}> <${del.o}>.\n`;
        currentAuths[del.auth] -= 1;
      }

      for (const [auth, count] of Object.entries(currentAuths)) {
        if (count < 1) {
          deleteRequest += this.generateNewAuthNode(auth);
        }
      }

      // we do the 2 calls in one, so it is in the same transaction, and will rollback in case of failure.
      await ctx.call('triplestore.update', {
        query: `INSERT DATA { GRAPH ${this.settings.graphName} { ${addRequest} } }; DELETE DATA { GRAPH ${this.settings.graphName} { ${deleteRequest} } }`,
        webId: 'system'
      });

      const defaultRightsUpdated =
        (isContainer && differenceAdd.some(triple => triple.auth.includes('#Default'))) ||
        differenceDelete.some(triple => triple.auth.includes('#Default'));
      ctx.emit(
        'webacl.resource.updated',
        { uri: resourceUri, isContainer, defaultRightsUpdated },
        { meta: { webId: null, dataset: null } }
      );
    }
  }
};
