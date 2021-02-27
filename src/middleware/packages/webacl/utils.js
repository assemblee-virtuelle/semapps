const { MIME_TYPES } = require('@semapps/mime-types');
const urlJoin = require('url-join');

const RESOURCE_CONTAINERS_QUERY = (resource) => `SELECT ?container
  WHERE { ?container ldp:contains <${resource}> . }`;

const findParentContainers = async (ctx, resource) => {

  let query = "PREFIX ldp: <http://www.w3.org/ns/ldp#>\n" +  RESOURCE_CONTAINERS_QUERY(resource);

  let containers = await ctx.call('triplestore.query', {
    query,
    accept: MIME_TYPES.SPARQL_JSON,
    webId: 'system'
  });

  return containers;

}

const USER_GROUPS_QUERY = (member, ACLGraphName) => { 
  return `SELECT ?group
  WHERE {
	{ ?group vcard:hasMember <${member}> . }
	UNION { GRAPH ${ACLGraphName} { ?group vcard:hasMember <${member}> . } }
  UNION
   {
    ?group ?anyLink <${member}> .
    ?anyLink rdfs:subPropertyOf vcard:hasMember .
   }
  }`;
}

const PREFIXES = "PREFIX vcard: <http://www.w3.org/2006/vcard/ns#>\n"+
"PREFIX acl: <http://www.w3.org/ns/auth/acl#>\n"+
"PREFIX foaf: <http://xmlns.com/foaf/0.1/>\n"+
"PREFIX ldp: <http://www.w3.org/ns/ldp#>\n"+
"PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n";


const getUserGroups = async (ctx, user, graphName) => {

  let query = PREFIXES + USER_GROUPS_QUERY(user, graphName);

  let groups = await ctx.call('triplestore.query', {
    query,
    accept: MIME_TYPES.JSON,
    webId: 'system'
  });

  return groups.map(g => g.group.value)

}

const AUTHORIZATION_NODE_QUERY = (mode, accesToOrDefault, resource, graphName) => `SELECT ?auth ?p ?o
WHERE { GRAPH ${graphName} {
  ?auth a acl:Authorization ;
    acl:mode acl:${mode};
    acl:${accesToOrDefault} <${resource}>;
    ?p ?o.
} }`;

const getAuthorizationNode = async (ctx, resourceUri, resourceAclUri, mode, graphName, seachForDefault) => {

  let query = "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\nPREFIX acl: <http://www.w3.org/ns/auth/acl#>\n"+ 
              AUTHORIZATION_NODE_QUERY(mode, seachForDefault? 'default':'accessTo', resourceUri, graphName);

  let auths = await ctx.call('triplestore.query', {
    query,
    accept: MIME_TYPES.JSON,
    webId: 'system'
  });

  return auths.map(a => {a.auth.value = resourceAclUri+'#'+ (seachForDefault?'Default':'')+mode; return a} );

}

const filterAgentAcl = (acl, agentSearchParam, forOutput) => {

  if (forOutput) {
    return (acl.p.value == 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type' 
    || acl.p.value == 'http://www.w3.org/ns/auth/acl#accessTo' 
    || acl.p.value == 'http://www.w3.org/ns/auth/acl#mode'
    || acl.p.value == 'http://www.w3.org/ns/auth/acl#default') 
  }

  if (agentSearchParam.foafAgent && acl.p.value == 'http://www.w3.org/ns/auth/acl#agentClass' && acl.o.value == 'http://xmlns.com/foaf/0.1/Agent')
    return true;
  
  if (agentSearchParam.authAgent && acl.p.value == 'http://www.w3.org/ns/auth/acl#agentClass' && acl.o.value == 'http://www.w3.org/ns/auth/acl#AuthenticatedAgent')
    return true;

  if (agentSearchParam.webId && acl.p.value == 'http://www.w3.org/ns/auth/acl#agent' && acl.o.value == agentSearchParam.webId)
    return true;
  
  if (agentSearchParam.groups && agentSearchParam.groups.length && acl.p.value == 'http://www.w3.org/ns/auth/acl#agentGroup' && agentSearchParam.groups.includes(acl.o.value))
    return true;

  return false;

}

function getUserAgentSearchParam(user, groups) {

  if (user === 'anon') {
    return {
      foafAgent: true
    }
  } else {
    return {
      foafAgent: true,
      authAgent: true,
      webId: user,
      groups: groups
    }
  }
}

const checkAgentPresent = ( acls , agentSearchParam ) => {

  for (const acl of acls) {

    let res = filterAgentAcl( acl, agentSearchParam);
    if (res) return true;

  }
  return false;

}

function getAclUriFromResourceUri(baseUrl, resourceUri) {
  return urlJoin(baseUrl, resourceUri.replace(baseUrl, '_acl/'))
}

module.exports = {
  getAuthorizationNode,
  checkAgentPresent,
  getUserGroups,
  findParentContainers,
  filterAgentAcl,
  getUserAgentSearchParam,
  getAclUriFromResourceUri
};