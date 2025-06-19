import { MIME_TYPES } from '@semapps/mime-types';
import urlJoin from 'url-join';

import { ServiceSchema, defineAction } from 'moleculer';
import {
  getAclUriFromResourceUri,
  convertBodyToTriples,
  filterTriplesForResource,
  FULL_AGENTCLASS_URI,
  FULL_FOAF_AGENT
} from '../../../utils.ts';

import { Errors as MoleculerErrors } from 'moleculer';
const { MoleculerError } = MoleculerErrors;

export const api = async function api(this: any, ctx: any) {
  const contentType = ctx.meta.headers['content-type'];
  let { slugParts } = ctx.params;

  if (!contentType || (contentType !== MIME_TYPES.JSON && contentType !== MIME_TYPES.TURTLE))
    throw new MoleculerError(`Content type not supported : ${contentType}`, 400, 'BAD_REQUEST');

  const newRights = await convertBodyToTriples(ctx.meta.body, contentType);
  // @ts-expect-error TS(18046): 'newRights' is of type 'unknown'.
  if (newRights.length === 0) throw new MoleculerError('PUT rights cannot be empty', 400, 'BAD_REQUEST');

  // This is the root container
  if (!slugParts || slugParts.length === 0) slugParts = ['/'];

  await ctx.call('webacl.resource.setRights', {
    resourceUri: urlJoin(this.settings.baseUrl, ...slugParts),
    newRights
  });

  ctx.meta.$statusCode = 204;
};

export const action = defineAction({
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
    // @ts-expect-error TS(2339): Property 'webId' does not exist on type '{}'.
    webId = webId || ctx.meta.webId || 'anon';

    // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
    const isContainer = await this.checkResourceOrContainerExists(ctx, resourceUri);

    // check that the user has Control perm.
    // TODO: bypass this check if user is 'system' (use system as a super-admin) ?
    const { control } = await ctx.call('webacl.resource.hasRights', {
      resourceUri,
      rights: { control: true },
      webId
    });
    if (!control) throw new MoleculerError('Access denied ! user must have Control permission', 403, 'ACCESS_DENIED');

    // filter out all the newRights that are not for the resource
    // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
    const aclUri = getAclUriFromResourceUri(this.settings.baseUrl, resourceUri);
    newRights = newRights.filter(a => filterTriplesForResource(a, aclUri, isContainer));

    if (newRights.length === 0)
      throw new MoleculerError('The rights cannot be changed because they are incorrect', 400, 'BAD_REQUEST');

    // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
    const currentPerms = await this.getExistingPerms(
      ctx,
      resourceUri,
      // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
      this.settings.baseUrl,
      // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
      this.settings.graphName,
      isContainer
    );

    // find the difference between newRights and currentPerms. add only what is not existent yet. and remove those that are not needed anymore
    const differenceAdd = newRights.filter(
      // @ts-expect-error TS(2339): Property 'auth' does not exist on type 'never'.
      x => !currentPerms.some((y: any) => x.auth === y.auth && x.o === y.o && x.p === y.p)
    );
    const differenceDelete = currentPerms.filter(
      // @ts-expect-error TS(2339): Property 'auth' does not exist on type 'never'.
      (x: any) => !newRights.some(y => x.auth === y.auth && x.o === y.o && x.p === y.p)
    );

    if (differenceAdd.length === 0 && differenceDelete.length === 0) return;

    // compile a list of Authorization already present. because if some of them don't exist, we need to create them
    // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
    const currentAuths = this.compileAuthorizationNodesMap(currentPerms);

    let addRequest = '';
    for (const add of differenceAdd) {
      // @ts-expect-error TS(2339): Property 'auth' does not exist on type 'never'.
      if (!currentAuths[add.auth]) {
        // @ts-expect-error TS(2723): Cannot invoke an object which is possibly 'null' o... Remove this comment to see the full error message
        addRequest += this.generateNewAuthNode(add.auth);
        // @ts-expect-error TS(2339): Property 'auth' does not exist on type 'never'.
        currentAuths[add.auth] = 1;
      } else {
        // @ts-expect-error TS(2339): Property 'auth' does not exist on type 'never'.
        currentAuths[add.auth] += 1;
      }
      // @ts-expect-error TS(2339): Property 'auth' does not exist on type 'never'.
      addRequest += `<${add.auth}> <${add.p}> <${add.o}>.\n`;
    }

    let deleteRequest = '';
    for (const del of differenceDelete) {
      deleteRequest += `<${del.auth}> <${del.p}> <${del.o}>.\n`;
      currentAuths[del.auth] -= 1;
    }

    for (const [auth, count] of Object.entries(currentAuths)) {
      // @ts-expect-error TS(18046): 'count' is of type 'unknown'.
      if (count < 1) {
        // @ts-expect-error TS(2723): Cannot invoke an object which is possibly 'null' o... Remove this comment to see the full error message
        deleteRequest += this.generateNewAuthNode(auth);
      }
    }

    // we do the 2 calls in one, so it is in the same transaction, and will rollback in case of failure.
    await ctx.call('triplestore.update', {
      // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
      query: `INSERT DATA { GRAPH <${this.settings.graphName}> { ${addRequest} } }; DELETE DATA { GRAPH <${this.settings.graphName}> { ${deleteRequest} } }`,
      webId: 'system'
    });

    const defaultRightsUpdated =
      isContainer &&
      // @ts-expect-error TS(2339): Property 'auth' does not exist on type 'never'.
      (differenceAdd.some(triple => triple.auth.includes('#Default')) ||
        differenceDelete.some((triple: any) => triple.auth.includes('#Default')));

    const addPublicRead = differenceAdd.some(
      // @ts-expect-error TS(2339): Property 'auth' does not exist on type 'never'.
      triple => triple.auth.includes('#Read') && triple.p === FULL_AGENTCLASS_URI && triple.o === FULL_FOAF_AGENT
    );
    const removePublicRead = differenceDelete.some(
      (triple: any) => triple.auth.includes('#Read') && triple.p === FULL_AGENTCLASS_URI && triple.o === FULL_FOAF_AGENT
    );
    const addDefaultPublicRead =
      isContainer &&
      differenceAdd.some(
        triple =>
          // @ts-expect-error TS(2339): Property 'auth' does not exist on type 'never'.
          triple.auth.includes('#DefaultRead') && triple.p === FULL_AGENTCLASS_URI && triple.o === FULL_FOAF_AGENT
      );
    const removeDefaultPublicRead =
      isContainer &&
      differenceDelete.some(
        (triple: any) =>
          triple.auth.includes('#DefaultRead') && triple.p === FULL_AGENTCLASS_URI && triple.o === FULL_FOAF_AGENT
      );

    const returnValues = {
      uri: resourceUri,
      webId,
      // @ts-expect-error TS(2339): Property 'dataset' does not exist on type '{}'.
      dataset: ctx.meta.dataset,
      // @ts-expect-error TS(2322): Type 'false' is not assignable to type 'ServiceSyn... Remove this comment to see the full error message
      created: false,
      isContainer,
      defaultRightsUpdated,
      addPublicRead,
      removePublicRead,
      addDefaultPublicRead,
      removeDefaultPublicRead
    } satisfies ServiceSchema;
    ctx.emit('webacl.resource.updated', returnValues, { meta: { webId: null, dataset: null } });
    return returnValues;
  }
});
