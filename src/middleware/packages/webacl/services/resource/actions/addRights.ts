import { MIME_TYPES } from '@semapps/mime-types';
import urlJoin from 'url-join';

import { ServiceSchema, defineAction } from 'moleculer';
import {
  getAclUriFromResourceUri,
  convertBodyToTriples,
  filterTriplesForResource,
  processRights,
  FULL_FOAF_AGENT,
  FULL_AGENTCLASS_URI
} from '../../../utils.ts';

import { Errors as MoleculerErrors } from 'moleculer';
const { MoleculerError } = MoleculerErrors;

export const api = async function api(this: any, ctx: any) {
  const contentType = ctx.meta.headers['content-type'];
  let { slugParts } = ctx.params;

  if (!contentType || (contentType !== MIME_TYPES.JSON && contentType !== MIME_TYPES.TURTLE))
    throw new MoleculerError(`Content type not supported : ${contentType}`, 400, 'BAD_REQUEST');

  const addedRights = await convertBodyToTriples(ctx.meta.body, contentType);
  // @ts-expect-error TS(18046): 'addedRights' is of type 'unknown'.
  if (addedRights.length === 0) throw new MoleculerError('Nothing to add', 400, 'BAD_REQUEST');

  // This is the root container
  if (!slugParts || slugParts.length === 0) slugParts = ['/'];

  await ctx.call('webacl.resource.addRights', {
    resourceUri: urlJoin(this.settings.baseUrl, ...slugParts),
    addedRights
  });

  ctx.meta.$statusCode = 204;
};

export const action = defineAction({
  visibility: 'public',
  params: {
    resourceUri: { type: 'string' },
    webId: { type: 'string', optional: true },
    // addedRights is an array of objects of the form { auth: 'http://localhost:3000/_acl/container29#Control',  p: 'http://www.w3.org/ns/auth/acl#agent',  o: 'https://data.virtual-assembly.org/users/sebastien.rosset' }
    // you will most likely prefer to use additionalRights instead.
    addedRights: { type: 'array', optional: true, min: 1 },
    // newRights is used to add rights to a non existing resource.
    newRights: { type: 'object', optional: true },
    // additionalRights is used to add rights to an existing resource.
    additionalRights: { type: 'object', optional: true }
  },
  async handler(ctx) {
    let { webId, addedRights, resourceUri, newRights, additionalRights } = ctx.params;
    // @ts-expect-error TS(2339): Property 'webId' does not exist on type '{}'.
    webId = webId || ctx.meta.webId || 'anon';

    let difference;
    let currentAuths;
    let isContainer: any;

    if (!newRights && (addedRights || additionalRights)) {
      if (!addedRights && !additionalRights)
        throw new MoleculerError('please use addedRights or additionalRights, none were provided', 403, 'BAD_REQUEST');

      // @ts-expect-error TS(2723): Cannot invoke an object which is possibly 'null' o... Remove this comment to see the full error message
      isContainer = await this.checkResourceOrContainerExists(ctx, resourceUri);

      // check that the user has Control perm.
      // bypass this check if user is 'system'
      if (webId !== 'system') {
        const { control } = await ctx.call('webacl.resource.hasRights', {
          resourceUri,
          rights: { control: true },
          webId
        });
        if (!control)
          throw new MoleculerError('Access denied ! user must have Control permission', 403, 'ACCESS_DENIED');
      }

      // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
      const aclUri = getAclUriFromResourceUri(this.settings.baseUrl, resourceUri);

      if (!addedRights) {
        // we process additionalRights only if addedRights was not set.
        // @ts-expect-error TS(2322): Type '{ auth: string; p: string; o: string; }[]' i... Remove this comment to see the full error message
        addedRights = processRights(additionalRights, `${aclUri}#`);
        // @ts-expect-error TS(18048): 'additionalRights' is possibly 'undefined'.
        if (isContainer && additionalRights.default)
          // @ts-expect-error TS(18048): 'addedRights' is possibly 'undefined'.
          addedRights = addedRights.concat(processRights(additionalRights.default, `${aclUri}#Default`));
        // @ts-expect-error TS(18048): 'addedRights' is possibly 'undefined'.
        if (addedRights.length === 0) new MoleculerError('No additional permissions to add!', 400, 'BAD_REQUEST');
      } else {
        // filter out all the addedRights that are not for the resource
        addedRights = addedRights.filter(a => filterTriplesForResource(a, aclUri, isContainer));
        if (addedRights.length === 0)
          throw new MoleculerError('The rights cannot be added because they are incorrect', 400, 'BAD_REQUEST');
      }

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

      // find the difference between addedRights and currentPerms. add only what is not existent yet.
      // @ts-expect-error TS(18048): 'addedRights' is possibly 'undefined'.
      difference = addedRights.filter(
        x => !currentPerms.some((y: any) => x.auth === y.auth && x.o === y.o && x.p === y.p)
      );
      if (difference.length === 0) return;

      // compile a list of Authorization already present. if some of them don't exist, we need to create them here below
      // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
      currentAuths = this.compileAuthorizationNodesMap(currentPerms);
    } else if (newRights) {
      // TODO: check that the resource doesn't exist. otherwise, raise an error
      if (webId !== 'system')
        throw new MoleculerError(
          'Access denied! Only system can add permissions for a newly created resource',
          403,
          'ACCESS_DENIED'
        );

      // we set new rights for a non existing resource
      // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
      const aclUri = `${getAclUriFromResourceUri(this.settings.baseUrl, resourceUri)}#`;
      difference = processRights(newRights, aclUri);
      // we do add default container permissions if any is set in newRights. but we cannot know for sure
      // that the resource that will be created will be a container. we don't want to add default permissions on a resource !
      // please be careful, as programmers, not to call newRights with 'default' perms for a resource.
      // it should only be used for containers
      // @ts-expect-error TS(2339): Property 'default' does not exist on type 'never'.
      if (newRights.default) difference = difference.concat(processRights(newRights.default, `${aclUri}Default`));
      currentAuths = {};
    }

    let addRequest = '';
    // @ts-expect-error TS(18048): 'difference' is possibly 'undefined'.
    for (const add of difference) {
      if (!currentAuths[add.auth]) {
        // @ts-expect-error TS(2723): Cannot invoke an object which is possibly 'null' o... Remove this comment to see the full error message
        addRequest += this.generateNewAuthNode(add.auth);
        currentAuths[add.auth] = true;
      }
      addRequest += `<${add.auth}> <${add.p}> <${add.o}>.\n`;
    }

    await ctx.call('triplestore.insert', {
      resource: addRequest,
      webId: 'system',
      // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
      graphName: this.settings.graphName
    });

    if (newRights) {
      // @ts-expect-error TS(2322): Type 'true' is not assignable to type 'ServiceSync... Remove this comment to see the full error message
      const returnValues = { uri: resourceUri, created: true, isContainer } satisfies ServiceSchema;
      ctx.emit('webacl.resource.created', returnValues, { meta: { webId: null, dataset: null } });
      return returnValues;
    }
    // @ts-expect-error TS(18048): 'difference' is possibly 'undefined'.
    const defaultRightsUpdated = isContainer && difference.some(triple => triple.auth.includes('#Default'));
    // @ts-expect-error TS(18048): 'difference' is possibly 'undefined'.
    const addPublicRead = difference.some(
      triple => triple.auth.includes('#Read') && triple.p === FULL_AGENTCLASS_URI && triple.o === FULL_FOAF_AGENT
    );
    const addDefaultPublicRead =
      isContainer &&
      // @ts-expect-error TS(18048): 'difference' is possibly 'undefined'.
      difference.some(
        triple =>
          triple.auth.includes('#DefaultRead') && triple.p === FULL_AGENTCLASS_URI && triple.o === FULL_FOAF_AGENT
      );

    const returnValues = {
      uri: resourceUri,
      // @ts-expect-error TS(2339): Property 'dataset' does not exist on type '{}'.
      dataset: ctx.meta.dataset,
      webId,
      // @ts-expect-error TS(2322): Type 'false' is not assignable to type 'ServiceSyn... Remove this comment to see the full error message
      created: false,
      isContainer,
      defaultRightsUpdated,
      addPublicRead,
      addDefaultPublicRead
    } satisfies ServiceSchema;
    ctx.emit('webacl.resource.updated', returnValues, { meta: { webId: null, dataset: null } });
    return returnValues;
  }
});
