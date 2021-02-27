const urlJoin = require('url-join');
const getRightsAction = require('./actions/getRights');
const setRightsAction = require('./actions/setRights');
const addRightsAction = require('./actions/addRights');
const hasRightsAction = require('./actions/hasRights');

module.exports = {
  name: 'webacl.resource',
  settings: {
    baseUrl: null,
    graphName: null,
  },
  dependencies: [ 'triplestore'],
  actions: {
    hasRights: hasRightsAction.action,
    // Actions accessible through the API
    api_getRights: getRightsAction.api,
    getRights: getRightsAction.action,
    api_setRights: setRightsAction.api,
    setRights: setRightsAction.action,
    api_addRights: addRightsAction.api,
    setRights: addRightsAction.action,
  }
};