const urlJoin = require('url-join');
const createAction = require('./actions/create');
const deleteAction = require('./actions/delete');
const addMemberAction = require('./actions/addMember');
const getMembersAction = require('./actions/getMembers');
const isMemberAction = require('./actions/isMember');
const removeMemberAction = require('./actions/removeMember');

module.exports = {
  name: 'webacl.group',
  settings: {
    baseUrl: null,
    graphName: null,
  },
  dependencies: [ 'triplestore'],
  actions: {
    create: createAction.action,
    delete: deleteAction.action,
    addMember: addMemberAction.action,
    getMembers: getMembersAction.action,
    isMember: isMemberAction.action,
    removeMember: removeMemberAction.action,
    // Actions accessible through the API
  }
};