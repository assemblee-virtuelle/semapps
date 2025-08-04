import urlJoin from 'url-join';

import {
  getAuthorizationNode,
  checkAgentPresent,
  getUserGroups,
  findParentContainers,
  getUserAgentSearchParam,
  getAclUriFromResourceUri
} from '../../../utils.ts';

const perms = {
  read: 'Read',
  write: 'Write',
  append: 'Append',
  control: 'Control'
};

async function checkRights(
  askedRights,
  resultRights,
  ctx,
  resourceUri,
  resourceAclUri,
  uaSearchParam,
  graphName,
  isContainerDefault
) {
  for (const [p1, p2] of Object.entries(perms)) {
    if (askedRights[p1] && !resultRights[p1]) {
      const permTuples = await getAuthorizationNode(
        ctx,
        resourceUri,
        resourceAclUri,
        p2,
        graphName,
        isContainerDefault
      );
      const hasPerm = checkAgentPresent(permTuples, uaSearchParam);
      if (hasPerm) resultRights[p1] = hasPerm;
    }
  }
}

async function hasPermissions(ctx, resourceUri, askedRights, baseUrl, user, graphName) {
  const resourceAclUri = getAclUriFromResourceUri(baseUrl, resourceUri);
  const resultRights = {};
  let groups;
  if (user !== 'anon') {
    // retrieve the groups of the user
    groups = await getUserGroups(ctx, user, graphName);
  }
  const uaSearchParam = getUserAgentSearchParam(user, groups);

  await checkRights(askedRights, resultRights, ctx, resourceUri, resourceAclUri, uaSearchParam, graphName);

  if (Object.keys(askedRights).length !== Object.keys(resultRights).length) {
    // we haven't found all the rights yet, we search in parent containers
    const parentContainers = await findParentContainers(ctx, resourceUri);

    while (parentContainers.length) {
      const container = parentContainers.shift();
      const containerUri = container.container.value;
      const aclUri = getAclUriFromResourceUri(baseUrl, containerUri);
      await checkRights(askedRights, resultRights, ctx, containerUri, aclUri, uaSearchParam, graphName, true);

      // if we are done finding all the asked rights, we return here, saving some processing.
      if (Object.keys(askedRights).length === Object.keys(resultRights).length) return resultRights;

      const moreParentContainers = await findParentContainers(ctx, containerUri);
      parentContainers.push(...moreParentContainers);
    }
  }

  // we put some false values if needed
  for (const p1 of Object.keys(perms)) {
    if (askedRights[p1] && !resultRights[p1]) resultRights[p1] = false;
  }

  return resultRights;
}

export const api = async function api(ctx) {
  let { slugParts } = ctx.params;

  // This is the root container
  if (!slugParts || slugParts.length === 0) slugParts = ['/'];

  return await ctx.call('webacl.resource.hasRights', {
    resourceUri: urlJoin(this.settings.baseUrl, ...slugParts),
    rights: ctx.params.rights,
    webId: ctx.meta.webId
  });
};

export const action = {
  visibility: 'public',
  params: {
    resourceUri: { type: 'string' },
    rights: {
      type: 'object',
      optional: true,
      strict: true,
      props: {
        read: { type: 'boolean', optional: true },
        write: { type: 'boolean', optional: true },
        append: { type: 'boolean', optional: true },
        control: { type: 'boolean', optional: true }
      }
    },
    webId: { type: 'string', optional: true }
  },
  cache: {
    enabled(ctx) {
      // Do not cache remote resources as we have no mecanism to clear this cache
      return ctx.params.resourceUri.startsWith(this.settings.baseUrl);
    },
    keys: ['resourceUri', 'rights', 'webId']
  },
  async handler(ctx) {
    let { resourceUri, webId, rights } = ctx.params;
    webId = webId || ctx.meta.webId || 'anon';
    rights = rights || {};
    if (Object.keys(rights).length === 0) rights = { read: true, write: true, append: true, control: true };

    await this.checkResourceOrContainerExists(ctx, resourceUri);
    return await hasPermissions(ctx, resourceUri, rights, this.settings.baseUrl, webId, this.settings.graphName);
  }
};
