const { MoleculerError } = require('moleculer').Errors;
const { MIME_TYPES } = require('@semapps/mime-types');
const { 
  getAclUriFromResourceUri,
  convertBodyToTriples,
  filterTriplesForResource,
  FULL_AGENT_URI,
  FULL_AGENTCLASS_URI,
  FULL_AGENT_GROUP,
  FULL_ACL_ANYAGENT,
  FULL_FOAF_AGENT
} = require('../../../utils');
const urlJoin = require('url-join');

const processNewRights = (newRights, aclUri) => {
  list = []
  if (newRights.anon) {
    if (newRights.anon.read) list.push({ auth: aclUri+'Read' , p: FULL_AGENTCLASS_URI, o: FULL_FOAF_AGENT });
    if (newRights.anon.write) list.push({ auth: aclUri+'Write' , p: FULL_AGENTCLASS_URI, o: FULL_FOAF_AGENT });
    if (newRights.anon.append) list.push({ auth: aclUri+'Append' , p: FULL_AGENTCLASS_URI, o: FULL_FOAF_AGENT });
    if (newRights.anon.control) list.push({ auth: aclUri+'Control' , p: FULL_AGENTCLASS_URI, o: FULL_FOAF_AGENT });
  }
  if (newRights.user && newRights.user.uri) {
    if (newRights.user.read) list.push({ auth: aclUri+'Read' , p: FULL_AGENT_URI, o: newRights.user.uri });
    if (newRights.user.write) list.push({ auth: aclUri+'Write' , p: FULL_AGENT_URI, o: newRights.user.uri });
    if (newRights.user.append) list.push({ auth: aclUri+'Append' , p: FULL_AGENT_URI, o: newRights.user.uri });
    if (newRights.user.control) list.push({ auth: aclUri+'Control' , p: FULL_AGENT_URI, o: newRights.user.uri });
  }
  if (newRights.anyUser) {
    if (newRights.anyUser.read) list.push({ auth: aclUri+'Read' , p: FULL_AGENTCLASS_URI, o: FULL_ACL_ANYAGENT });
    if (newRights.anyUser.write) list.push({ auth: aclUri+'Write' , p: FULL_AGENTCLASS_URI, o: FULL_ACL_ANYAGENT });
    if (newRights.anyUser.append) list.push({ auth: aclUri+'Append' , p: FULL_AGENTCLASS_URI, o: FULL_ACL_ANYAGENT });
    if (newRights.anyUser.control) list.push({ auth: aclUri+'Control' , p: FULL_AGENTCLASS_URI, o: FULL_ACL_ANYAGENT });
  }
  if (newRights.group && newRights.group.uri) {
    if (newRights.group.read) list.push({ auth: aclUri+'Read' , p: FULL_AGENT_GROUP, o: newRights.group.uri });
    if (newRights.group.write) list.push({ auth: aclUri+'Write' , p: FULL_AGENT_GROUP, o: newRights.group.uri });
    if (newRights.group.append) list.push({ auth: aclUri+'Append' , p: FULL_AGENT_GROUP, o: newRights.group.uri });
    if (newRights.group.control) list.push({ auth: aclUri+'Control' , p: FULL_AGENT_GROUP, o: newRights.group.uri });
  }
  return list;
}

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
      // you will most likely prefer to use additionalRights instead.
      addedRights: { type: 'array', optional: true, min:1 },
      // newRights is used to add rights to a non existing resource.
      newRights: { type: 'object', optional: true },
      // additionalRights is used to add rights to an existing resource.
      additionalRights: { type: 'object', optional: true },
    },
    async handler(ctx) {
      let { slugParts, webId, addedRights, resourceUri, newRights, additionalRights } = ctx.params;
      webId = webId || ctx.meta.webId || 'anon';
      
      let difference;
      let currentAuths;

      if (!newRights && ( addedRights || additionalRights ) ) {

        if (!addedRights && !additionalRights) throw new MoleculerError('please use addedRights or additionalRights, none were provided', 403, 'BAD_REQUEST');

        if (!slugParts || slugParts.length == 0) {
          // this is the root container.
          slugParts = ['/'] ;
        }
        resourceUri = resourceUri || urlJoin(this.settings.baseUrl, ...slugParts);
        let isContainer = await this.checkResourceOrContainerExists(ctx, resourceUri);

        // check that the user has Control perm.
        // bypass this check if user is 'system'
        if (webId != 'system') {
          let {control} = await ctx.call('webacl.resource.hasRights', {
            resourceUri,
            rights : { control:true },
            webId
          });
          if (!control) throw new MoleculerError('Access denied ! user must have Control permission', 403, 'ACCESS_DENIED');
        }

        let aclUri = getAclUriFromResourceUri(this.settings.baseUrl,resourceUri)

        if (!addedRights) {
          // we process additionalRights only if addedRights was not set.
          addedRights = processNewRights(additionalRights, aclUri+'#');
          if (isContainer && additionalRights.default) addedRights = addedRights.concat( processNewRights(additionalRights.default, aclUri+'#Default'));
          if (addedRights.length == 0) new MoleculerError('No additional permissions to add!', 400, 'BAD_REQUEST');

        } else {
          // filter out all the addedRights that are not for the resource
          addedRights = addedRights.filter(a => filterTriplesForResource(a, aclUri, isContainer));
          if (addedRights.length == 0) throw new MoleculerError('The rights cannot be added because they are incorrect', 400, 'BAD_REQUEST');

        }
        //console.log(addedRights)

        let currentPerms = await this.getExistingPerms(ctx, resourceUri, this.settings.baseUrl, this.settings.graphName, isContainer);

        //console.log(currentPerms)

        // find the difference between addedRights and currentPerms. add only what is not existant yet.
        difference = addedRights.filter(x => !currentPerms.some(y => x.auth == y.auth && x.o == y.o && x.p == y.p));

        //console.log(difference)
        if (difference.length == 0) return;

        // compile a list of Authorization already present. if some of them don't exist, we need to create them here below
        currentAuths = this.compileAuthorizationNodesMap(currentPerms);
      }
      else if (newRights) {
        // TODO: check that the resource doesn't exist. otherwise, raise an error
        if (webId != 'system')
          throw new MoleculerError('Access denied ! only system can add permissions for a newly created resource', 403, 'ACCESS_DENIED');

        // we set new rights for a non existing resource
        let aclUri = getAclUriFromResourceUri(this.settings.baseUrl,resourceUri) + '#'
        difference = processNewRights(newRights, aclUri);
        // we do add default container permissions if any is set in newRights. but we cannot know for sure 
        // that the resource that will be created will be a container. we don't want to add default permissions on a resource !
        // please be careful, as programmers, not to call newRights with 'default' perms for a resource.
        // it should only be used for containers
        if (newRights.default) difference = difference.concat( processNewRights(newRights.default, aclUri+'Default'));
        currentAuths = {}
             
        if (difference.length == 0) new MoleculerError('No permission set for the new resource. This won\'t work!', 400, 'BAD_REQUEST');
      }

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
