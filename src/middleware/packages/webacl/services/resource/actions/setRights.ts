const { MoleculerError } = require('moleculer').Errors;
import { MIME_TYPES } from '@semapps/mime-types';
import urlJoin from 'url-join';

import {
  getAclUriFromResourceUri,
  convertBodyToTriples,
  filterTriplesForResource,
  FULL_AGENTCLASS_URI,
  FULL_FOAF_AGENT
} from '../../../utils.ts';

export const api = async function api(ctx) {
  const contentType = ctx.meta.headers['content-type'];
  let { slugParts } = ctx.params;

  if (!contentType || (contentType !== MIME_TYPES.JSON && contentType !== MIME_TYPES.TURTLE))
    throw new MoleculerError(`Content type not supported : ${contentType}`, 400, 'BAD_REQUEST');

  const newRights = await convertBodyToTriples(ctx.meta.rawBody, contentType);
  if (newRights.length === 0) throw new MoleculerError('PUT rights cannot be empty', 400, 'BAD_REQUEST');

  // This is the root container
  if (!slugParts || slugParts.length === 0) slugParts = ['/'];

  await ctx.call('webacl.resource.setRights', {
    resourceUri: urlJoin(this.settings.baseUrl, ...slugParts),
    newRights
  });

  ctx.meta.$statusCode = 204;
};

export const action = {
  visibility: 'public',
  params: {
    resourceUri: { type: 'string' },
    webId: { type: 'string', optional: true },
    // newRights is an array of objects of the form { auth: 'http://localhost:3000/_acl/container29#Control',  p: 'http://www.w3.org/ns/auth/acl#agent',  o: 'https://data.virtual-assembly.org/users/sebastien.rosset' }
    newRights: { type: 'array', optional: false, min: 1 }
    // minimum is one right : We cannot leave a resource without rights.
  },
  async handler(ctx) {
    let { webId, newRights, resourceUri } = ctx.params;
    webId = webId || ctx.meta.webId || 'anon';

    const isContainer = await this.checkResourceOrContainerExists(ctx, resourceUri);

    await ctx.call('permissions.check', {
      uri: resourceUri,
      type: isContainer ? 'container' : 'resource',
      mode: 'acl:Control',
      webId
    });

    // filter out all the newRights that are not for the resource
    const aclUri = getAclUriFromResourceUri(this.settings.baseUrl, resourceUri);
    newRights = newRights.filter(a => filterTriplesForResource(a, aclUri, isContainer));

    if (newRights.length === 0)
      throw new MoleculerError('The rights cannot be changed because they are incorrect', 400, 'BAD_REQUEST');

    const currentPerms = await this.getExistingPerms(
      ctx,
      resourceUri,
      this.settings.baseUrl,
      this.settings.graphName,
      isContainer
    );

    // find the difference between newRights and currentPerms. add only what is not existent yet. and remove those that are not needed anymore
    const differenceAdd = newRights.filter(
      x => !currentPerms.some(y => x.auth === y.auth && x.o === y.o && x.p === y.p)
    );
    const differenceDelete = currentPerms.filter(
      x => !newRights.some(y => x.auth === y.auth && x.o === y.o && x.p === y.p)
    );

    if (differenceAdd.length === 0 && differenceDelete.length === 0) return;

    // compile a list of Authorization already present. because if some of them don't exist, we need to create them
    const currentAuths = this.compileAuthorizationNodesMap(currentPerms);

    let addRequest = '';
    for (const add of differenceAdd) {
      if (!currentAuths[add.auth]) {
        addRequest += this.generateNewAuthNode(add.auth);
        currentAuths[add.auth] = 1;
      } else {
        currentAuths[add.auth] += 1;
      }
      addRequest += `<${add.auth}> <${add.p}> <${add.o}>.\n`;
    }

    let deleteRequest = '';
    for (const del of differenceDelete) {
      deleteRequest += `<${del.auth}> <${del.p}> <${del.o}>.\n`;
      currentAuths[del.auth] -= 1;
    }

    for (const [auth, count] of Object.entries(currentAuths)) {
      if (count < 1) {
        deleteRequest += this.generateNewAuthNode(auth);
      }
    }

    // we do the 2 calls in one, so it is in the same transaction, and will rollback in case of failure.
    await ctx.call('triplestore.update', {
      query: `INSERT DATA { GRAPH <${this.settings.graphName}> { ${addRequest} } }; DELETE DATA { GRAPH <${this.settings.graphName}> { ${deleteRequest} } }`,
      webId: 'system'
    });

    const defaultRightsUpdated =
      isContainer &&
      (differenceAdd.some(triple => triple.auth.includes('#Default')) ||
        differenceDelete.some(triple => triple.auth.includes('#Default')));

    const addPublicRead = differenceAdd.some(
      triple => triple.auth.includes('#Read') && triple.p === FULL_AGENTCLASS_URI && triple.o === FULL_FOAF_AGENT
    );
    const removePublicRead = differenceDelete.some(
      triple => triple.auth.includes('#Read') && triple.p === FULL_AGENTCLASS_URI && triple.o === FULL_FOAF_AGENT
    );
    const addDefaultPublicRead =
      isContainer &&
      differenceAdd.some(
        triple =>
          triple.auth.includes('#DefaultRead') && triple.p === FULL_AGENTCLASS_URI && triple.o === FULL_FOAF_AGENT
      );
    const removeDefaultPublicRead =
      isContainer &&
      differenceDelete.some(
        triple =>
          triple.auth.includes('#DefaultRead') && triple.p === FULL_AGENTCLASS_URI && triple.o === FULL_FOAF_AGENT
      );

    const returnValues = {
      uri: resourceUri,
      webId,
      dataset: ctx.meta.dataset,
      created: false,
      isContainer,
      defaultRightsUpdated,
      addPublicRead,
      removePublicRead,
      addDefaultPublicRead,
      removeDefaultPublicRead
    };
    ctx.emit('webacl.resource.updated', returnValues, { meta: { webId: null, dataset: null } });
    return returnValues;
  }
};
