import { defineAction } from 'moleculer';

const Schema = defineAction({
  visibility: 'public',
  params: {
    containerUri: { type: 'string' },
    webId: { type: 'string', optional: true }
  },
  async handler(ctx) {
    let { containerUri, webId } = ctx.params;

    // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
    const resourcesUris = await this.actions.getUris({ containerUri }, { parentCtx: ctx });

    // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
    this.logger.info(`Deleting ${resourcesUris.length} resources...`);

    for (let resourceUri of resourcesUris) {
      // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
      this.logger.info(`Deleting ${resourceUri}...`);
      await ctx.call('ldp.resource.delete', { resourceUri, webId });
    }
  }
});

export default Schema;
