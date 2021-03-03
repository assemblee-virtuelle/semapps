const urlJoin = require('url-join');
const createAction = require('./actions/create');
const deleteAction = require('./actions/delete');
const addMemberAction = require('./actions/addMember');
const getMembersAction = require('./actions/getMembers');
const isMemberAction = require('./actions/isMember');
const removeMemberAction = require('./actions/removeMember');
const getGroupsAction = require('./actions/getGroups');

module.exports = {
  name: 'webacl.group',
  settings: {
    baseUrl: null,
    graphName: null
  },
  dependencies: ['triplestore'],
  actions: {
    isMember: isMemberAction.action,
    // Actions accessible through the API
    addMember: addMemberAction.action,
    api_addMember: addMemberAction.api,
    create: createAction.action,
    api_create: createAction.api,
    delete: deleteAction.action,
    api_delete: deleteAction.api,
    getGroups: getGroupsAction.action,
    api_getGroups: getGroupsAction.api,
    getMembers: getMembersAction.action,
    api_getMembers: getMembersAction.api,
    removeMember: removeMemberAction.action,
    api_removeMember: removeMemberAction.api
  }
};
