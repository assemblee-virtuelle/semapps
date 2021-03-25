const urlJoin = require('url-join');
const getRightsAction = require('./actions/getRights');
const setRightsAction = require('./actions/setRights');
const addRightsAction = require('./actions/addRights');
const hasRightsAction = require('./actions/hasRights');
const deleteAllRightsAction = require('./actions/deleteAllRights');
const { MoleculerError } = require('moleculer').Errors;
const {
  getAuthorizationNode,
  getAclUriFromResourceUri,
  aclGroupExists,
  agentPredicates,
  FULL_ACCESSTO_URI,
  FULL_DEFAULT_URI,
  FULL_MODE_URI,
  FULL_TYPE_URI,
  ACL_NS
} = require('../../utils');

const filterAclsOnlyAgent = acl => {
  if (agentPredicates.includes(acl.p.value)) return true;
  return false;
};

module.exports = {
  name: 'webacl.resource',
  settings: {
    baseUrl: null,
    graphName: null
  },
  dependencies: ['triplestore'],
  actions: {
    deleteAllRights: deleteAllRightsAction.action,
    // Actions accessible through the API
    api_hasRights: hasRightsAction.api,
    hasRights: hasRightsAction.action,
    api_getRights: getRightsAction.api,
    getRights: getRightsAction.action,
    api_setRights: setRightsAction.api,
    setRights: setRightsAction.action,
    api_addRights: addRightsAction.api,
    addRights: addRightsAction.action
  },
  methods: {
    // will return true if it is a container, false otherwise
    async checkResourceOrContainerExists(ctx, resourceUri) {
      // Ensure LDP services have been started
      // We cannot add them as dependencies as this creates circular dependencies
      await ctx.broker.waitForServices(['ldp.container', 'ldp.resource']);

      if (resourceUri.startsWith(urlJoin(this.settings.baseUrl, '_group'))) {
        let exists = await aclGroupExists(resourceUri, ctx, this.settings.graphName);
        if (!exists)
          throw new MoleculerError(`Cannot get permissions of non-existing ACL group ${resourceUri}`, 404, 'NOT_FOUND');
        return false; // it is never a container
      }
      // it can be a container or a resource
      const containerExist = await ctx.call(
        'ldp.container.exist',
        { containerUri: resourceUri },
        { meta: { webId: 'system' } }
      );
      if (!containerExist) {
        // it must be a resource then!
        const resourceExist = await ctx.call('ldp.resource.exist', { resourceUri }, { meta: { webId: 'system' } });
        if (!resourceExist) {
          throw new MoleculerError(
            `Cannot get permissions of non-existing container or resource ${resourceUri}`,
            404,
            'NOT_FOUND'
          );
        }
        return false;
      } else return true;
    },

    async getExistingPerms(ctx, resourceUri, baseUrl, graphName, isContainer) {
      let resourceAclUri = getAclUriFromResourceUri(baseUrl, resourceUri);

      let document = [];

      document.push(...(await getAuthorizationNode(ctx, resourceUri, resourceAclUri, 'Read', graphName)));
      document.push(...(await getAuthorizationNode(ctx, resourceUri, resourceAclUri, 'Write', graphName)));
      document.push(...(await getAuthorizationNode(ctx, resourceUri, resourceAclUri, 'Append', graphName)));
      document.push(...(await getAuthorizationNode(ctx, resourceUri, resourceAclUri, 'Control', graphName)));

      if (isContainer) {
        document.push(...(await getAuthorizationNode(ctx, resourceUri, resourceAclUri, 'Read', graphName, true)));
        document.push(...(await getAuthorizationNode(ctx, resourceUri, resourceAclUri, 'Write', graphName, true)));
        document.push(...(await getAuthorizationNode(ctx, resourceUri, resourceAclUri, 'Append', graphName, true)));
        document.push(...(await getAuthorizationNode(ctx, resourceUri, resourceAclUri, 'Control', graphName, true)));
      }

      return document
        .filter(a => filterAclsOnlyAgent(a))
        .map(a => {
          return { auth: a.auth.value, p: a.p.value, o: a.o.value };
        });
    },

    compileAuthorizationNodesMap(nodes) {
      let result = {};
      for (const node of nodes) {
        result[node.auth] = result[node.auth] ? result[node.auth] + 1 : 1;
      }
      return result;
    },

    generateNewAuthNode(auth) {
      let split = auth.split('#');
      let resUrl = split[0].replace('/_acl', '');
      let defaultAcl = split[1].startsWith('Default');
      let mode = defaultAcl ? split[1].replace('Default', '') : split[1];
      let cmd = `<${auth}> <${FULL_TYPE_URI}> <${ACL_NS}Authorization>.\n`;
      cmd += `<${auth}> <${FULL_MODE_URI}> <${ACL_NS}${mode}>.\n`;
      cmd += `<${auth}> <${defaultAcl ? FULL_DEFAULT_URI : FULL_ACCESSTO_URI}> <${resUrl}>.\n`;
      return cmd;
    }
  }
};
