import { JsonLdSerializer } from 'jsonld-streaming-serializer';
import { DataFactory, Writer } from 'n3';
import urlJoin from 'url-join';
import { MIME_TYPES } from '@semapps/mime-types';

import { ActionSchema } from 'moleculer';
import {
  getAuthorizationNode,
  findParentContainers,
  filterAgentAcl,
  getAclUriFromResourceUri,
  getUserAgentSearchParam
} from '../../../utils.ts';

const { quad } = DataFactory;
const { MoleculerError } = require('moleculer').Errors;

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

function streamToString(stream: any) {
  let res = '';
  return new Promise((resolve, reject) => {
    stream.on('data', (chunk: any) => (res += chunk));
    stream.on('error', (err: any) => reject(err));
    stream.on('end', () => resolve(res));
  });
}

async function formatOutput(ctx: any, output: any, resourceAclUri: any, jsonLD: any) {
  const turtle = await new Promise((resolve, reject) => {
    const writer = new Writer({
      prefixes: { ...prefixes, '': `${resourceAclUri}#` },
      format: 'Turtle'
    });
    output.forEach((f: any) => writer.addQuad(f.auth, f.p, f.o));
    writer.end((error, res) => {
      resolve(res);
    });
  });

  if (!jsonLD) return turtle;

  const mySerializer = new JsonLdSerializer({
    context: webAclContext,
    baseIRI: resourceAclUri
  });

  output.forEach((f: any) => mySerializer.write(quad(f.auth, f.p, f.o)));
  mySerializer.end();

  // @ts-expect-error TS(2345): Argument of type 'unknown' is not assignable to pa... Remove this comment to see the full error message
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

async function filterAcls(hasControl: any, uaSearchParam: any, acls: any) {
  if (hasControl) return acls;

  const filtered = acls.filter((acl: any) => filterAgentAcl(acl, uaSearchParam, false));
  if (filtered.length) {
    const header = acls.filter((acl: any) => filterAgentAcl(acl, uaSearchParam, true));
    return header.concat(filtered);
  }

  return [];
}

async function getPermissions(ctx: any, resourceUri: any, baseUrl: any, user: any, graphName: any, isContainer: any) {
  const resourceAclUri = getAclUriFromResourceUri(baseUrl, resourceUri);
  // @ts-expect-error TS(2554): Expected 2 arguments, but got 1.
  const uaSearchParam = getUserAgentSearchParam(user);
  const document = [];

  // Check if the user has a acl:Control permission
  // If so, it will return all WAC permissions associated with the resource
  // Otherwise only the permissions associated with the given user will be returned

  const hasControl = await ctx.call('permissions.has', {
    uri: resourceUri,
    type: isContainer ? 'container' : 'resource',
    mode: 'acl:Control',
    webId: user
  });

  // Get the ACL for the resource

  // @ts-expect-error TS(2554): Expected 6 arguments, but got 5.
  const reads = await getAuthorizationNode(ctx, resourceUri, resourceAclUri, 'Read', graphName);
  // @ts-expect-error TS(2554): Expected 6 arguments, but got 5.
  const writes = await getAuthorizationNode(ctx, resourceUri, resourceAclUri, 'Write', graphName);
  // @ts-expect-error TS(2554): Expected 6 arguments, but got 5.
  const appends = await getAuthorizationNode(ctx, resourceUri, resourceAclUri, 'Append', graphName);
  // @ts-expect-error TS(2554): Expected 6 arguments, but got 5.
  const controls = await getAuthorizationNode(ctx, resourceUri, resourceAclUri, 'Control', graphName);

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

  // Get the ACLs for all the parent containers

  const parentContainers = await findParentContainers(ctx, resourceUri);
  const containersMap = {};

  while (parentContainers.length) {
    const container = parentContainers.shift();
    const containerUri = container.container.value;
    const aclUri = getAclUriFromResourceUri(baseUrl, containerUri);

    const reads = await getAuthorizationNode(ctx, containerUri, aclUri, 'Read', graphName, true);
    const writes = await getAuthorizationNode(ctx, containerUri, aclUri, 'Write', graphName, true);
    const appends = await getAuthorizationNode(ctx, containerUri, aclUri, 'Append', graphName, true);
    const controls = await getAuthorizationNode(ctx, containerUri, aclUri, 'Control', graphName, true);

    // we keep all the authorization nodes we found
    // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    containersMap[containerUri] = {
      reads,
      writes,
      appends,
      controls
    };

    const moreParentContainers = await findParentContainers(ctx, containerUri);
    parentContainers.push(...moreParentContainers);
  }

  for (const value of Object.values(containersMap)) {
    // @ts-expect-error TS(18046): 'value' is of type 'unknown'.
    document.push(...(await filterAcls(hasControl, uaSearchParam, value.reads)));
    // @ts-expect-error TS(18046): 'value' is of type 'unknown'.
    document.push(...(await filterAcls(hasControl, uaSearchParam, value.writes)));
    // @ts-expect-error TS(18046): 'value' is of type 'unknown'.
    document.push(...(await filterAcls(hasControl, uaSearchParam, value.appends)));
    // @ts-expect-error TS(18046): 'value' is of type 'unknown'.
    document.push(...(await filterAcls(hasControl, uaSearchParam, value.controls)));
  }

  // Format output

  return await formatOutput(ctx, document, resourceAclUri, ctx.meta.$responseType === MIME_TYPES.JSON);
}

export const api = async function api(this: any, ctx: any) {
  const { accept } = ctx.meta.headers;
  let { slugParts } = ctx.params;

  if (accept && accept !== MIME_TYPES.JSON && accept !== MIME_TYPES.TURTLE)
    throw new MoleculerError(`Accept not supported : ${accept}`, 400, 'ACCEPT_NOT_SUPPORTED');

  // This is the root container
  if (!slugParts || slugParts.length === 0) slugParts = ['/'];

  return await ctx.call('webacl.resource.getRights', {
    resourceUri: urlJoin(this.settings.baseUrl, ...slugParts),
    accept
  });
};

export const action = {
  visibility: 'public',
  params: {
    resourceUri: { type: 'string' },
    // @ts-expect-error TS(2322): Type '{ type: "string"; default: string; }' is not... Remove this comment to see the full error message
    accept: { type: 'string', default: MIME_TYPES.JSON },
    webId: { type: 'string', optional: true },
    // @ts-expect-error TS(2322): Type '{ type: "boolean"; default: false; }' is not... Remove this comment to see the full error message
    skipResourceCheck: { type: 'boolean', default: false }
  },
  cache: {
    keys: ['resourceUri', 'accept', 'webId', '#webId']
  },
  async handler(ctx) {
    let { resourceUri, webId, accept, skipResourceCheck } = ctx.params;
    // @ts-expect-error TS(2339): Property 'webId' does not exist on type '{}'.
    webId = webId || ctx.meta.webId || 'anon';

    accept = accept || MIME_TYPES.TURTLE;
    // @ts-expect-error TS(2339): Property '$responseType' does not exist on type '{... Remove this comment to see the full error message
    ctx.meta.$responseType = accept;

    // @ts-expect-error TS(2723): Cannot invoke an object which is possibly 'null' o... Remove this comment to see the full error message
    const isContainer = !skipResourceCheck && (await this.checkResourceOrContainerExists(ctx, resourceUri));

    // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
    return await getPermissions(ctx, resourceUri, this.settings.baseUrl, webId, this.settings.graphName, isContainer);
  }
} satisfies ActionSchema;
