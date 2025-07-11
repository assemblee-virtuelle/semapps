const urlJoin = require('url-join');
const { MoleculerError } = require('moleculer').Errors;
const addRights = require('./actions/addRights');
const awaitReadRight = require('./actions/awaitReadRight');
const deleteAllRights = require('./actions/deleteAllRights');
const deleteAllUserRights = require('./actions/deleteAllUserRights');
const getLink = require('./actions/getLink');
const getRights = require('./actions/getRights');
const getUsersWithReadRights = require('./actions/getUsersWithReadRights');
const hasRights = require('./actions/hasRights');
const isPublic = require('./actions/isPublic');
const refreshContainersRights = require('./actions/refreshContainersRights');
const removeRights = require('./actions/removeRights');
const setRights = require('./actions/setRights');
const {
  getAuthorizationNode,
  getAclUriFromResourceUri,
  aclGroupExists,
  agentPredicates,
  FULL_ACCESSTO_URI,
  FULL_DEFAULT_URI,
  FULL_MODE_URI,
  FULL_TYPE_URI,
  ACL_NS,
  getDatasetFromUri
} = require('../../utils');

const filterAclsOnlyAgent = acl => agentPredicates.includes(acl.p.value);

/**
 * Server for handling webacl resource and container rights.
 *
 * **There are two different formats in which rights are expressed:**
 * - The triple authorization nodes format (https://semapps.org/docs/middleware/webacl/resource#getrights)
 *  - triples in the form <https://my.resource#Read> <acl:agent> <https://mypod.store/laurin>
 *    - e.g. `{ auth: 'http://localhost:3000/_acl/container29#Control',  p: 'http://www.w3.org/ns/auth/acl#agent',  o: 'https://data.virtual-assembly.org/users/sebastien.rosset' }`
 * - The nested json format as used in "additionalRights" (https://semapps.org/docs/middleware/webacl/resource#addrights)
 *  - organized by user, group, anon, anyUser. See the documentation for the details.
 */
module.exports = {
  name: 'webacl.resource',
  settings: {
    baseUrl: null,
    graphName: null,
    podProvider: false
  },
  dependencies: ['triplestore', 'jsonld', 'ldp.link-header'],
  started() {
    // Register so that HEAD requests to LDP resources & containers may return links to ACL
    this.broker.call('ldp.link-header.register', { actionName: 'webacl.resource.getLink' });
  },
  actions: {
    addRights: addRights.action,
    awaitReadRight: awaitReadRight.action,
    deleteAllRights: deleteAllRights.action,
    deleteAllUserRights: deleteAllUserRights.action,
    getLink: getLink.action,
    getRights: getRights.action,
    hasRights: hasRights.action,
    isPublic: isPublic.action,
    getUsersWithReadRights: getUsersWithReadRights.action,
    refreshContainersRights: refreshContainersRights.action,
    removeRights: removeRights.action,
    setRights: setRights.action,
    // Actions accessible through the API
    api_addRights: addRights.api,
    api_hasRights: hasRights.api,
    api_getRights: getRights.api,
    api_setRights: setRights.api
  },
  hooks: {
    before: {
      '*'(ctx) {
        if (this.settings.podProvider && !ctx.meta.dataset && ctx.params.resourceUri) {
          ctx.meta.dataset = getDatasetFromUri(ctx.params.resourceUri);
        }
      }
    }
  },
  methods: {
    // will return true if it is a container, false otherwise
    async checkResourceOrContainerExists(ctx, resourceUri) {
      // Ensure LDP services have been started
      // We cannot add them as dependencies as this creates circular dependencies
      await this.broker.waitForServices(['ldp.container', 'ldp.resource']);

      if (resourceUri.startsWith(urlJoin(this.settings.baseUrl, '_groups'))) {
        const exists = await aclGroupExists(resourceUri, ctx, this.settings.graphName);
        if (!exists)
          throw new MoleculerError(`Cannot get permissions of non-existing ACL group ${resourceUri}`, 404, 'NOT_FOUND');
        return false; // it is never a container
      }
      // it can be a container or a resource
      const containerExist = await ctx.call('ldp.container.exist', { containerUri: resourceUri });
      if (!containerExist) {
        // it must be a resource then!
        const resourceExist = await ctx.call('ldp.resource.exist', { resourceUri, webId: 'system' });
        if (!resourceExist) {
          throw new MoleculerError(
            `Cannot get permissions of non-existing container or resource ${resourceUri} (webId ${ctx.meta.webId} / dataset ${ctx.meta.dataset})`,
            404,
            'NOT_FOUND'
          );
        }
        return false;
      }
      return true;
    },
    async getExistingPerms(ctx, resourceUri, baseUrl, graphName, isContainer) {
      const resourceAclUri = getAclUriFromResourceUri(baseUrl, resourceUri);

      const document = [];

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
      const result = {};
      for (const node of nodes) {
        result[node.auth] = result[node.auth] ? result[node.auth] + 1 : 1;
      }
      return result;
    },
    generateNewAuthNode(auth) {
      const split = auth.split('#');
      const resUrl = split[0].replace('/_acl', '');
      const defaultAcl = split[1].startsWith('Default');
      const mode = defaultAcl ? split[1].replace('Default', '') : split[1];
      let cmd = `<${auth}> <${FULL_TYPE_URI}> <${ACL_NS}Authorization>.\n`;
      cmd += `<${auth}> <${FULL_MODE_URI}> <${ACL_NS}${mode}>.\n`;
      cmd += `<${auth}> <${defaultAcl ? FULL_DEFAULT_URI : FULL_ACCESSTO_URI}> <${resUrl}>.\n`;
      return cmd;
    }
  }
};
