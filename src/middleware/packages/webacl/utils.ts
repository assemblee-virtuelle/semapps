const { arrayOf } = require('@semapps/ldp');
const { MIME_TYPES } = require('@semapps/mime-types');
const { MoleculerError } = require('moleculer').Errors;
const urlJoin = require('url-join');
const { Parser } = require('n3');
const streamifyString = require('streamify-string');
const rdfParser = require('rdf-parse').default;

const RESOURCE_CONTAINERS_QUERY = resource => `SELECT ?container
  WHERE { ?container ldp:contains <${resource}> . }`;

const getSlugFromUri = str => str.match(new RegExp(`.*/(.*)`))[1];

const hasType = (resource, type) => {
  const resourceType = resource.type || resource['@type'];
  return Array.isArray(resourceType) ? resourceType.includes(type) : resourceType === type;
};

// Transforms "http://localhost:3000/dataset/data" to "dataset"
const getDatasetFromUri = uri => {
  const path = new URL(uri).pathname;
  const parts = path.split('/');
  if (parts.length > 1) return parts[1];
};

const findParentContainers = async (ctx, resource) => {
  const query = `PREFIX ldp: <http://www.w3.org/ns/ldp#>\n${RESOURCE_CONTAINERS_QUERY(resource)}`;

  return await ctx.call('triplestore.query', {
    query,
    accept: MIME_TYPES.SPARQL_JSON,
    webId: 'system'
  });
};

const USER_GROUPS_QUERY = (member, ACLGraphName) => {
  return `SELECT ?group
  WHERE {
	{ ?group vcard:hasMember <${member}> . }
	UNION { GRAPH <${ACLGraphName}> { ?group vcard:hasMember <${member}> . } }
  UNION
   {
    ?group ?anyLink <${member}> .
    ?anyLink rdfs:subPropertyOf vcard:hasMember .
   }
  }`;
};

const PREFIXES =
  'PREFIX vcard: <http://www.w3.org/2006/vcard/ns#>\n' +
  'PREFIX acl: <http://www.w3.org/ns/auth/acl#>\n' +
  'PREFIX foaf: <http://xmlns.com/foaf/0.1/>\n' +
  'PREFIX ldp: <http://www.w3.org/ns/ldp#>\n' +
  'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n';

const getUserGroups = async (ctx, user, graphName) => {
  const query = PREFIXES + USER_GROUPS_QUERY(user, graphName);

  const groups = await ctx.call('triplestore.query', {
    query,
    accept: MIME_TYPES.JSON,
    webId: 'system'
  });

  return groups.map(g => g.group.value);
};

const AUTHORIZATION_NODE_QUERY = (mode, accesToOrDefault, resource, graphName) => `SELECT ?auth ?p ?o
WHERE { GRAPH <${graphName}> {
  ?auth
    acl:${accesToOrDefault} <${resource}>;
    acl:mode acl:${mode};
    a acl:Authorization ;
    ?p ?o.
} }`;

const getAuthorizationNode = async (ctx, resourceUri, resourceAclUri, mode, graphName, searchForDefault) => {
  const query = `PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\nPREFIX acl: <http://www.w3.org/ns/auth/acl#>\n${AUTHORIZATION_NODE_QUERY(
    mode,
    searchForDefault ? 'default' : 'accessTo',
    resourceUri,
    graphName
  )}`;

  const auths = await ctx.call('triplestore.query', {
    query,
    accept: MIME_TYPES.JSON,
    webId: 'system'
  });

  return auths.map(a => {
    a.auth.value = `${resourceAclUri}#${searchForDefault ? 'Default' : ''}${mode}`;
    return a;
  });
};

const FULL_TYPE_URI = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type';
const FULL_ACCESSTO_URI = 'http://www.w3.org/ns/auth/acl#accessTo';
const FULL_MODE_URI = 'http://www.w3.org/ns/auth/acl#mode';
const FULL_DEFAULT_URI = 'http://www.w3.org/ns/auth/acl#default';
const ACL_NS = 'http://www.w3.org/ns/auth/acl#';
const FULL_AGENTCLASS_URI = 'http://www.w3.org/ns/auth/acl#agentClass';
const FULL_AGENT_URI = 'http://www.w3.org/ns/auth/acl#agent';
const FULL_AGENT_GROUP = 'http://www.w3.org/ns/auth/acl#agentGroup';
const FULL_FOAF_AGENT = 'http://xmlns.com/foaf/0.1/Agent';
const FULL_ACL_ANYAGENT = 'http://www.w3.org/ns/auth/acl#AuthenticatedAgent';

const filterAgentAcl = (acl, agentSearchParam, forOutput) => {
  if (forOutput) {
    return (
      acl.p.value === FULL_TYPE_URI ||
      acl.p.value === FULL_ACCESSTO_URI ||
      acl.p.value === FULL_MODE_URI ||
      acl.p.value === FULL_DEFAULT_URI
    );
  }

  if (agentSearchParam.foafAgent && acl.p.value === FULL_AGENTCLASS_URI && acl.o.value === FULL_FOAF_AGENT) return true;

  if (agentSearchParam.authAgent && acl.p.value === FULL_AGENTCLASS_URI && acl.o.value === FULL_ACL_ANYAGENT)
    return true;

  if (agentSearchParam.webId && acl.p.value === FULL_AGENT_URI && acl.o.value === agentSearchParam.webId) return true;

  if (
    agentSearchParam.groups &&
    agentSearchParam.groups.length &&
    acl.p.value === FULL_AGENT_GROUP &&
    agentSearchParam.groups.includes(acl.o.value)
  )
    return true;

  return false;
};

function getUserAgentSearchParam(user, groups) {
  if (user === 'anon') {
    return {
      foafAgent: true
    };
  }
  if (user === 'system') {
    return {
      system: true
    };
  }
  return {
    foafAgent: true,
    authAgent: true,
    webId: user,
    groups: groups
  };
}

const checkAgentPresent = (acls, agentSearchParam) => {
  for (const acl of acls) {
    const res = filterAgentAcl(acl, agentSearchParam);
    if (res) return true;
  }
  return false;
};

const agentPredicates = [FULL_AGENTCLASS_URI, FULL_AGENT_URI, FULL_AGENT_GROUP];

async function aclGroupExists(groupUri, ctx, graphName) {
  return await ctx.call('triplestore.query', {
    query: `
      PREFIX vcard: <http://www.w3.org/2006/vcard/ns#>
      ASK
      WHERE { GRAPH <${graphName}> {
        <${groupUri}> a vcard:Group .
      } }
    `,
    webId: 'system'
  });
}

function getAclUriFromResourceUri(baseUrl, resourceUri) {
  return resourceUri.startsWith(baseUrl)
    ? urlJoin(baseUrl, resourceUri.replace(baseUrl, baseUrl.endsWith('/') ? '_acl/' : '_acl'))
    : resourceUri;
}

function filterAndConvertTriple(quad, property) {
  if (agentPredicates.includes(quad.predicate[property])) {
    return {
      auth: quad.subject[property],
      p: quad.predicate[property],
      o: quad.object[property]
    };
  }
  return false;
}

const AuthorizationSuffixes = ['Read', 'Write', 'Append', 'Control'];

const AuthorizationDefaultSuffixes = ['DefaultRead', 'DefaultWrite', 'DefaultAppend', 'DefaultControl'];

function filterTriplesForResource(triple, resourceAclUri, allowDefault) {
  const split = triple.auth.split('#');
  if (split[0] !== resourceAclUri) return false;
  if (AuthorizationSuffixes.includes(split[1])) return true;
  if (allowDefault && AuthorizationDefaultSuffixes.includes(split[1])) return true;
  return false;
}

async function convertBodyToTriples(body, contentType) {
  if (contentType === MIME_TYPES.TURTLE) {
    return new Promise((resolve, reject) => {
      const parser = new Parser({ format: 'turtle' });
      const res = [];
      parser.parse(body, (error, quad, prefixes) => {
        if (error) reject(error);
        else if (quad) {
          const q = filterAndConvertTriple(quad, 'id');
          if (q) res.push(q);
        } else resolve(res);
      });
    });
  }
  // TODO use jsonld.toQuads actions ?
  return new Promise((resolve, reject) => {
    const textStream = streamifyString(body);
    const res = [];
    rdfParser
      .parse(textStream, {
        contentType: 'application/ld+json'
      })
      .on('data', quad => {
        const q = filterAndConvertTriple(quad, 'value');
        if (q) res.push(q);
      })
      .on('error', error => reject(error))
      .on('end', () => {
        resolve(res);
      });
  });
}

// TODO: if one day you code a delete Profile action (probably in webid service)
// then you msut call the below method after deleting the user (and pass false to isGroup)

async function removeAgentGroupOrAgentFromAuthorizations(uri, isGroup, graphName, ctx) {
  // removing the acl:agentGroup relation to some Authorizations
  await ctx.call('triplestore.update', {
    query: `PREFIX acl: <http://www.w3.org/ns/auth/acl#>
      DELETE WHERE { GRAPH <${graphName}> { ?auth ${isGroup ? 'acl:agentGroup' : 'acl:agent'} <${uri}> }}`,
    webId: 'system'
  });

  // removing the Authorizations that are now empty
  await ctx.call('triplestore.update', {
    query: `PREFIX acl: <http://www.w3.org/ns/auth/acl#>
      WITH <${graphName}>
      DELETE { ?auth ?p ?o }
      WHERE { ?auth a acl:Authorization; ?p ?o
        FILTER NOT EXISTS { ?auth acl:agent ?z }
        FILTER NOT EXISTS { ?auth acl:agentGroup ?z2 }
        FILTER NOT EXISTS { ?auth acl:agentClass ?z3 }
      }`,
    webId: 'system'
  });
}

const processRights = (rights, aclUri) => {
  const list = [];
  if (rights.anon) {
    if (rights.anon.read) list.push({ auth: `${aclUri}Read`, p: FULL_AGENTCLASS_URI, o: FULL_FOAF_AGENT });
    if (rights.anon.write) list.push({ auth: `${aclUri}Write`, p: FULL_AGENTCLASS_URI, o: FULL_FOAF_AGENT });
    if (rights.anon.append) list.push({ auth: `${aclUri}Append`, p: FULL_AGENTCLASS_URI, o: FULL_FOAF_AGENT });
    if (rights.anon.control) list.push({ auth: `${aclUri}Control`, p: FULL_AGENTCLASS_URI, o: FULL_FOAF_AGENT });
  }
  if (rights.user && rights.user.uri) {
    arrayOf(rights.user.uri).forEach(uri => {
      if (rights.user.read) list.push({ auth: `${aclUri}Read`, p: FULL_AGENT_URI, o: uri });
      if (rights.user.write) list.push({ auth: `${aclUri}Write`, p: FULL_AGENT_URI, o: uri });
      if (rights.user.append) list.push({ auth: `${aclUri}Append`, p: FULL_AGENT_URI, o: uri });
      if (rights.user.control) list.push({ auth: `${aclUri}Control`, p: FULL_AGENT_URI, o: uri });
    });
  }
  if (rights.anyUser) {
    if (rights.anyUser.read) list.push({ auth: `${aclUri}Read`, p: FULL_AGENTCLASS_URI, o: FULL_ACL_ANYAGENT });
    if (rights.anyUser.write) list.push({ auth: `${aclUri}Write`, p: FULL_AGENTCLASS_URI, o: FULL_ACL_ANYAGENT });
    if (rights.anyUser.append) list.push({ auth: `${aclUri}Append`, p: FULL_AGENTCLASS_URI, o: FULL_ACL_ANYAGENT });
    if (rights.anyUser.control) list.push({ auth: `${aclUri}Control`, p: FULL_AGENTCLASS_URI, o: FULL_ACL_ANYAGENT });
  }
  if (rights.group && rights.group.uri) {
    arrayOf(rights.group.uri).forEach(uri => {
      if (rights.group.read) list.push({ auth: `${aclUri}Read`, p: FULL_AGENT_GROUP, o: uri });
      if (rights.group.write) list.push({ auth: `${aclUri}Write`, p: FULL_AGENT_GROUP, o: uri });
      if (rights.group.append) list.push({ auth: `${aclUri}Append`, p: FULL_AGENT_GROUP, o: uri });
      if (rights.group.control) list.push({ auth: `${aclUri}Control`, p: FULL_AGENT_GROUP, o: uri });
    });
  }
  return list;
};

module.exports = {
  getSlugFromUri,
  hasType,
  getDatasetFromUri,
  getAuthorizationNode,
  checkAgentPresent,
  getUserGroups,
  findParentContainers,
  filterAgentAcl,
  getUserAgentSearchParam,
  getAclUriFromResourceUri,
  convertBodyToTriples,
  agentPredicates,
  filterTriplesForResource,
  aclGroupExists,
  removeAgentGroupOrAgentFromAuthorizations,
  processRights,
  FULL_TYPE_URI,
  FULL_ACCESSTO_URI,
  FULL_DEFAULT_URI,
  FULL_MODE_URI,
  ACL_NS,
  FULL_AGENTCLASS_URI,
  FULL_AGENT_URI,
  FULL_AGENT_GROUP,
  FULL_FOAF_AGENT,
  FULL_ACL_ANYAGENT
};
