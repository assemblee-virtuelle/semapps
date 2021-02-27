const urlJoin = require('url-join');
const getRightsAction = require('./actions/getRights');
const setRightsAction = require('./actions/setRights');
const addRightsAction = require('./actions/addRights');
const hasRightsAction = require('./actions/hasRights');
const { MoleculerError } = require('moleculer').Errors;

module.exports = {
  name: 'webacl.resource',
  settings: {
    baseUrl: null,
    graphName: null,
  },
  dependencies: [ 'triplestore'],
  actions: {
    // Actions accessible through the API
    api_hasRights: hasRightsAction.api,
    hasRights: hasRightsAction.action,
    api_getRights: getRightsAction.api,
    getRights: getRightsAction.action,
    api_setRights: setRightsAction.api,
    setRights: setRightsAction.action,
    api_addRights: addRightsAction.api,
    setRights: addRightsAction.action,
  },
  methods: {
    // will return true if it is a container, false otherwise
    async checkResourceOrContainerExists(ctx, resourceUri) {
      // it can be a container or a resource
      const containerExist = await ctx.call('ldp.container.exist', { containerUri:resourceUri },{ meta: { webId:'system' } });
      if (!containerExist) {
        // it must be a resource then!
        const resourceExist = await ctx.call('ldp.resource.exist', { resourceUri },{ meta: { webId:'system' } });
        if (!resourceExist) {
          throw new MoleculerError(
            `Cannot get permissions of non-existing container or resource ${resourceUri}`,
            404, 'NOT_FOUND'
          );
        }
        return false;
      }
      else return true;
    }
  }
};