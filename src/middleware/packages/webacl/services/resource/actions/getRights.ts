import { JsonLdSerializer } from 'jsonld-streaming-serializer';
import { DataFactory, Writer } from 'n3';
const { quad } = DataFactory;
import urlJoin from 'url-join';
import { MIME_TYPES } from '@semapps/mime-types';
const { MoleculerError } = require('moleculer').Errors;

import {
  getAuthorizationNode,
  checkAgentPresent,
  getUserGroups,
  findParentContainers,
  filterAgentAcl,
  getAclUriFromResourceUri,
  getUserAgentSearchParam
} from '../../../utils.ts';

const prefixes = {
  acl: 'http://www.w3.org/ns/auth/acl#',
  foaf: 'http://xmlns.com/foaf/0.1/'
};

const webAclContext = {
  ...prefixes,
  'acl:accessTo': {
    '@type': '@id'
  },
  'acl:agentClass': {
    '@type': '@id'
  },
  'acl:agent': {
    '@type': '@id'
  },
  'acl:agentGroup': {
    '@type': '@id'
  },
  'acl:default': {
    '@type': '@id'
  },
  'acl:mode': {
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

async function formatOutput(ctx, output, resourceAclUri, jsonLD) {
  const turtle = await new Promise((resolve, reject) => {
    const writer = new Writer({
      prefixes: { ...prefixes, '': `${resourceAclUri}#` },
      format: 'Turtle'
    });
    output.forEach(f => writer.addQuad(f.auth, f.p, f.o));
    writer.end((error, res) => {
      resolve(res);
    });
  });

  if (!jsonLD) return turtle;

  const mySerializer = new JsonLdSerializer({
    context: webAclContext,
    baseIRI: resourceAclUri
  });

  output.forEach(f => mySerializer.write(quad(f.auth, f.p, f.o)));
  mySerializer.end();

  const jsonLd = JSON.parse(await streamToString(mySerializer));

  const compactJsonLd = await ctx.call('jsonld.parser.frame', {
    input: jsonLd,
    frame: {
      '@context': webAclContext,
      '@type': 'acl:Authorization'
    },
    // Force results to be in a @graph, even if we have a single result
    options: { omitGraph: false }
  });

  // Add the @base context. We did not use it in the frame operation, as we don't want URIs to become relative
  compactJsonLd['@context'] = { ...compactJsonLd['@context'], '@base': resourceAclUri };

  return compactJsonLd;
}

async function filterAcls(hasControl, uaSearchParam, acls) {
  if (hasControl || uaSearchParam.system) return acls;

  const filtered = acls.filter(acl => filterAgentAcl(acl, uaSearchParam, false));
  if (filtered.length) {
    const header = acls.filter(acl => filterAgentAcl(acl, uaSearchParam, true));
    return header.concat(filtered);
  }

  return [];
}

async function getPermissions(ctx, resourceUri, baseUrl, user, graphName, isContainer) {
  const resourceAclUri = getAclUriFromResourceUri(baseUrl, resourceUri);
  const controls = await getAuthorizationNode(ctx, resourceUri, resourceAclUri, 'Control', graphName);
  const uaSearchParam = getUserAgentSearchParam(user);
  let hasControl = checkAgentPresent(controls, uaSearchParam);
  let groups;

  if (!hasControl && user !== 'anon' && user !== 'system') {
    // retrieve the groups of the user
    groups = await getUserGroups(ctx, user, graphName);
    uaSearchParam.groups = groups;
    // we check again for the groups. maybe user has control from a group
    hasControl = checkAgentPresent(controls, uaSearchParam);
  }

  // we continue to search for control perms, now in the parent containers (but we take everything anyway)

  const parentContainers = await findParentContainers(ctx, resourceUri);
  const containersMap = {};

  while (parentContainers.length) {
    const container = parentContainers.shift();
    const containerUri = container.container.value;
    const aclUri = getAclUriFromResourceUri(baseUrl, containerUri);
    const containerControls = await getAuthorizationNode(ctx, containerUri, aclUri, 'Control', graphName, true);

    if (!hasControl) {
      hasControl = checkAgentPresent(containerControls, uaSearchParam);
    }

    const reads = await getAuthorizationNode(ctx, containerUri, aclUri, 'Read', graphName, true);
    const writes = await getAuthorizationNode(ctx, containerUri, aclUri, 'Write', graphName, true);
    const appends = await getAuthorizationNode(ctx, containerUri, aclUri, 'Append', graphName, true);

    // we keep all the authorization nodes we found
    containersMap[containerUri] = {
      reads,
      writes,
      appends,
      controls: containerControls
    };

    const moreParentContainers = await findParentContainers(ctx, containerUri);
    parentContainers.push(...moreParentContainers);
  }

  // we finish to get all the ACLs for the resource itself
  const reads = await getAuthorizationNode(ctx, resourceUri, resourceAclUri, 'Read', graphName);
  const writes = await getAuthorizationNode(ctx, resourceUri, resourceAclUri, 'Write', graphName);
  const appends = await getAuthorizationNode(ctx, resourceUri, resourceAclUri, 'Append', graphName);

  const document = [];

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

  return await formatOutput(ctx, document, resourceAclUri, ctx.meta.$responseType === MIME_TYPES.JSON);
}

export const api = async function api(ctx) {
  const { accept } = ctx.meta.headers;
  let { slugParts } = ctx.params;

  if (accept && accept !== MIME_TYPES.JSON && accept !== MIME_TYPES.TURTLE)
    throw new MoleculerError(`Accept not supported : ${accept}`, 400, 'ACCEPT_NOT_SUPPORTED');

  // This is the root container
  if (!slugParts || slugParts.length === 0) slugParts = ['/'];

  return await ctx.call('webacl.resource.getRights', {
    resourceUri: urlJoin(this.settings.baseUrl, ...slugParts),
    accept: accept
  });
};

export const action = {
  visibility: 'public',
  params: {
    resourceUri: { type: 'string' },
    accept: { type: 'string', optional: true },
    webId: { type: 'string', optional: true },
    skipResourceCheck: { type: 'boolean', default: false }
  },
  cache: {
    keys: ['resourceUri', 'accept', 'webId', '#webId']
  },
  async handler(ctx) {
    let { resourceUri, webId, accept, skipResourceCheck } = ctx.params;
    webId = webId || ctx.meta.webId || 'anon';

    accept = accept || MIME_TYPES.TURTLE;
    ctx.meta.$responseType = accept;

    const isContainer = !skipResourceCheck && (await this.checkResourceOrContainerExists(ctx, resourceUri));

    return await getPermissions(ctx, resourceUri, this.settings.baseUrl, webId, this.settings.graphName, isContainer);
  }
};
