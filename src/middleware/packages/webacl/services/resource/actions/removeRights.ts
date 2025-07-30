import { defineAction, Errors as MoleculerErrors } from 'moleculer';
import { getAclUriFromResourceUri, processRights, FULL_AGENTCLASS_URI, FULL_FOAF_AGENT } from '../../../utils.ts';

const { MoleculerError } = MoleculerErrors;

// eslint-disable-next-line import/prefer-default-export
export const action = defineAction({
  visibility: 'public',
  params: {
    // @ts-expect-error TS(2322): Type '{ type: "string"; optional: false; }' is not... Remove this comment to see the full error message
    resourceUri: { type: 'string', optional: false },
    webId: { type: 'string', optional: true },
    /** In nested json format (e.g. `{anon: {read: true}}`) */
    // @ts-expect-error TS(2322): Type '{ type: "object"; optional: false; }' is not... Remove this comment to see the full error message
    rights: { type: 'object', optional: false }
  },
  async handler(ctx) {
    let { resourceUri, rights, webId } = ctx.params;

    const aclUri = getAclUriFromResourceUri(this.settings.baseUrl, resourceUri);

    // @ts-expect-error TS(2339): Property 'webId' does not exist on type '{}'.
    webId = webId || ctx.meta.webId || 'anon';

    if (webId !== 'system') {
      const { control } = await ctx.call('webacl.resource.hasRights', {
        resourceUri,
        rights: { control: true },
        webId
      });
      if (!control) throw new MoleculerError('Access denied ! user must have Control permission', 403, 'ACCESS_DENIED');
    }

    const isContainer = await this.checkResourceOrContainerExists(ctx, resourceUri);

    let processedRights = processRights(rights, `${aclUri}#`);
    if (isContainer && rights.default)
      processedRights = processedRights.concat(processRights(rights.default, `${aclUri}#Default`));

    await ctx.call('triplestore.update', {
      query: `
        PREFIX acl: <http://www.w3.org/ns/auth/acl#>
        DELETE DATA {
          GRAPH <${this.settings.graphName}> {
            ${processedRights.map(right => `<${right.auth}> <${right.p}> <${right.o}> .`).join('\n')}
          }
        }
      `,
      webId: 'system'
    });

    const defaultRightsUpdated = isContainer && processedRights.some(triple => triple.auth.includes('#Default'));
    const removePublicRead = processedRights.some(
      triple => triple.auth.includes('#Read') && triple.p === FULL_AGENTCLASS_URI && triple.o === FULL_FOAF_AGENT
    );
    const removeDefaultPublicRead =
      isContainer &&
      processedRights.some(
        triple =>
          triple.auth.includes('#DefaultRead') && triple.p === FULL_AGENTCLASS_URI && triple.o === FULL_FOAF_AGENT
      );

    ctx.emit(
      'webacl.resource.updated',
      {
        uri: resourceUri,
        webId,
        // @ts-expect-error TS(2339): Property 'dataset' does not exist on type '{}'.
        dataset: ctx.meta.dataset,
        isContainer,
        defaultRightsUpdated,
        removePublicRead,
        removeDefaultPublicRead
      },
      { meta: { webId: null, dataset: null } }
    );
  }
});
