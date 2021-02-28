const jsonld = require('jsonld');
const JsonLdSerializer = require('jsonld-streaming-serializer').JsonLdSerializer;
const { DataFactory, Writer } = require('n3');
const { namedNode, literal, defaultGraph, quad } = DataFactory;
const urlJoin = require('url-join');
const { MIME_TYPES } = require('@semapps/mime-types');
const { MoleculerError } = require('moleculer').Errors;

const {
  getAuthorizationNode,
  checkAgentPresent,
  getUserGroups,
  findParentContainers,
  filterAgentAcl,
  getAclUriFromResourceUri,
  getUserAgentSearchParam
} = require('../../../utils');

const prefixes = {
  //'rdf': 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
  acl: 'http://www.w3.org/ns/auth/acl#',
  foaf: 'http://xmlns.com/foaf/0.1/'
};

const prefixesJsonLD = {
  ...prefixes,
  'acl:accessTo': {
    '@id': 'http://www.w3.org/ns/auth/acl#accessTo',
    '@type': '@id'
  },
  'acl:agentClass': {
    '@id': 'http://www.w3.org/ns/auth/acl#agentClass',
    '@type': '@id'
  },
  'acl:agent': {
    '@id': 'http://www.w3.org/ns/auth/acl#agent',
    '@type': '@id'
  },
  'acl:agentGroup': {
    '@id': 'http://www.w3.org/ns/auth/acl#agentGroup',
    '@type': '@id'
  },
  'acl:default': {
    '@id': 'http://www.w3.org/ns/auth/acl#default',
    '@type': '@id'
  },
  'acl:mode': {
    '@id': 'http://www.w3.org/ns/auth/acl#mode',
    '@type': '@id'
  }
};

function streamToString(stream) {
  let res = '';
  return new Promise((resolve, reject) => {
    stream.on('data', chunk => (res += chunk));
    stream.on('error', err => reject(err));
    stream.on('end', () => resolve(res));
  });
}

async function formatOutput(output, resourceAclUri, jsonLD) {
  let turtle = await new Promise((resolve, reject) => {
    const writer = new Writer({
      prefixes: { ...prefixes, '': resourceAclUri + '#' },
      format: 'Turtle'
    });
    output.forEach(f => writer.addQuad(f.auth, f.p, f.o));
    writer.end((error, res) => {
      resolve(res);
    });
  });

  if (!jsonLD) return turtle;
  else {
    const mySerializer = new JsonLdSerializer({
      //space: '  ',
      context: prefixesJsonLD,
      baseIRI: resourceAclUri
    });

    output.forEach(f => mySerializer.write(quad(f.auth, f.p, f.o)));
    mySerializer.end();
    let jsonld1 = JSON.parse(await streamToString(mySerializer));
    //console.log(JSON.stringify(jsonld1,null,2))

    let jsonld2 = await jsonld.compact(jsonld1, prefixesJsonLD);
    // trick to clean up the jsonld in case we have only one auth node and compact removed the @graph level
    if (jsonld2['@id']) {
      jsonld2 = { '@context': {}, '@graph': [jsonld2] };
      delete jsonld2['@graph'][0]['@context'];
    }
    jsonld2['@context'] = { ...prefixes, '@base': resourceAclUri };

    return jsonld2;
  }
}

async function filterAcls(hasControl, uaSearchParam, acls) {
  if (hasControl) return acls;

  let filtered = acls.filter(acl => filterAgentAcl(acl, uaSearchParam, false));
  if (filtered.length) {
    let header = acls.filter(acl => filterAgentAcl(acl, uaSearchParam, true));
    let full = header.concat(filtered);
    return full;
  }

  return [];
}

async function getPermissions(ctx, resourceUri, baseUrl, user, graphName, isContainer) {
  let resourceAclUri = getAclUriFromResourceUri(baseUrl, resourceUri);
  let controls = await getAuthorizationNode(ctx, resourceUri, resourceAclUri, 'Control', graphName);
  let uaSearchParam = getUserAgentSearchParam(user);
  let hasControl = checkAgentPresent(controls, uaSearchParam);
  let groups;

  if (!hasControl && user !== 'anon') {
    // retrive the groups of the user
    groups = await getUserGroups(ctx, user, graphName);
    uaSearchParam.groups = groups;
    // we check again for the groups. maybe user has control from a group
    hasControl = checkAgentPresent(controls, uaSearchParam);
  }

  // we continue to search for control perms, now in the parent containers (but we take everything anyway)

  let parentContainers = await findParentContainers(ctx, resourceUri);
  let containersMap = {};

  while (parentContainers.length) {
    let container = parentContainers.shift();
    let containerUri = container.container.value;
    let aclUri = getAclUriFromResourceUri(baseUrl, containerUri);
    let containerControls = await getAuthorizationNode(ctx, containerUri, aclUri, 'Control', graphName, true);

    if (!hasControl) {
      hasControl = checkAgentPresent(containerControls, uaSearchParam);
    }

    let reads = await getAuthorizationNode(ctx, containerUri, aclUri, 'Read', graphName, true);
    let writes = await getAuthorizationNode(ctx, containerUri, aclUri, 'Write', graphName, true);
    let appends = await getAuthorizationNode(ctx, containerUri, aclUri, 'Append', graphName, true);

    // we keep all the authorization nodes we found
    containersMap[containerUri] = {
      reads,
      writes,
      appends,
      controls: containerControls
    };

    let moreParentContainers = await findParentContainers(ctx, containerUri);
    parentContainers.push(...moreParentContainers);
  }

  // we finish to get all the ACLs for the resource itself
  let reads = await getAuthorizationNode(ctx, resourceUri, resourceAclUri, 'Read', graphName);
  let writes = await getAuthorizationNode(ctx, resourceUri, resourceAclUri, 'Write', graphName);
  let appends = await getAuthorizationNode(ctx, resourceUri, resourceAclUri, 'Append', graphName);

  let document = [];

  document.push(...(await filterAcls(hasControl, uaSearchParam, reads)));
  document.push(...(await filterAcls(hasControl, uaSearchParam, writes)));
  document.push(...(await filterAcls(hasControl, uaSearchParam, appends)));
  document.push(...(await filterAcls(hasControl, uaSearchParam, controls)));

  if (isContainer && hasControl) {
    document.push(...(await getAuthorizationNode(ctx, resourceUri, resourceAclUri, 'Read', graphName, true)));
    document.push(...(await getAuthorizationNode(ctx, resourceUri, resourceAclUri, 'Write', graphName, true)));
    document.push(...(await getAuthorizationNode(ctx, resourceUri, resourceAclUri, 'Append', graphName, true)));
    document.push(...(await getAuthorizationNode(ctx, resourceUri, resourceAclUri, 'Control', graphName, true)));
  }

  for (const [key, value] of Object.entries(containersMap)) {
    document.push(...(await filterAcls(hasControl, uaSearchParam, value.reads)));
    document.push(...(await filterAcls(hasControl, uaSearchParam, value.writes)));
    document.push(...(await filterAcls(hasControl, uaSearchParam, value.appends)));
    document.push(...(await filterAcls(hasControl, uaSearchParam, value.controls)));
  }

  let result = await formatOutput(document, resourceAclUri, ctx.meta.$responseType == MIME_TYPES.JSON);

  return result;
}

module.exports = {
  api: async function api(ctx) {
    const accept = ctx.meta.headers.accept;
    if (accept && accept != MIME_TYPES.JSON && accept != MIME_TYPES.TURTLE)
      throw new MoleculerError('Accept not supported : ' + accept, 400, 'ACCEPT_NOT_SUPPORTED');

    return await ctx.call('webacl.resource.getRights', {
      slugParts: ctx.params.slugParts,
      accept: accept
    });
  },
  action: {
    visibility: 'public',
    params: {
      resourceUri: { type: 'string', optional: true },
      slugParts: { type: 'array', items: 'string', optional: true },
      webId: { type: 'string', optional: true },
      accept: { type: 'string', optional: true }
    },
    async handler(ctx) {
      let { slugParts, webId, accept, resourceUri } = ctx.params;
      webId = webId || ctx.meta.webId || 'anon';

      accept = accept || MIME_TYPES.TURTLE;
      ctx.meta.$responseType = accept;

      if (!slugParts || slugParts.length == 0) {
        // this is the root container.
        slugParts = ['/'];
      }
      resourceUri = resourceUri || urlJoin(this.settings.baseUrl, ...slugParts);
      let isContainer = await this.checkResourceOrContainerExists(ctx, resourceUri);

      return await getPermissions(ctx, resourceUri, this.settings.baseUrl, webId, this.settings.graphName, isContainer);
    }
  }
};
