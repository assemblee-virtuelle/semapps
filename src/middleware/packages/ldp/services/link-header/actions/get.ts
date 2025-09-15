import LinkHeader from 'http-link-header';
import { ActionSchema } from 'moleculer';

const Schema = {
  visibility: 'public',
  params: {
    uri: { type: 'string' }
  },
  async handler(ctx) {
    const { uri } = ctx.params;
    const linkHeader = new LinkHeader();

    // @ts-expect-error TS(2488): Type 'string | number | boolean | any[] | Record<a... Remove this comment to see the full error message
    for (const actionName of this.registeredActionNames) {
      const params = await ctx.call(actionName, { uri });

      if (params) {
        if (!params.uri) throw new Error(`An uri should be returned from the ${actionName} action`);

        linkHeader.set(params);
      }
    }

    // Get container-specific headers (if any)
    const { controlledActions } = await ctx.call('ldp.registry.getByUri', { resourceUri: uri });
    if (controlledActions?.getHeaderLinks) {
      const links = await ctx.call(controlledActions.getHeaderLinks, { uri });
      if (links && links.length > 0) {
        for (const link of links) {
          linkHeader.set(link);
        }
      }
    }

    return linkHeader.toString();
  }
} satisfies ActionSchema;

export default Schema;
