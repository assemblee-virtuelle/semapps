import LinkHeader from 'http-link-header';
import { ActionSchema } from 'moleculer';
import { Registration } from '../../../types.ts';

const GetAction = {
  visibility: 'public',
  params: {
    uri: { type: 'string' },
    additionalLinks: { type: 'array' }
  },
  async handler(ctx) {
    const { uri, additionalLinks } = ctx.params;
    const linkHeader = new LinkHeader();

    for (const actionName of this.registeredActionNames) {
      const params: any = await ctx.call(actionName, { uri });
      if (params) {
        if (!params.uri) throw new Error(`An uri should be returned from the ${actionName} action`);
        linkHeader.set(params);
      }
    }

    // Get container-specific headers (if any)
    const { controlledActions }: Registration = await ctx.call('ldp.registry.getByUri', { resourceUri: uri });
    if (controlledActions?.getHeaderLinks) {
      const links: any[] = await ctx.call(controlledActions.getHeaderLinks, { uri });
      if (links && links.length > 0) {
        for (const link of links) {
          linkHeader.set(link);
        }
      }
    }

    if (additionalLinks) {
      for (const additionalLink of additionalLinks) {
        linkHeader.set(additionalLink);
      }
    }

    return linkHeader.toString();
  }
} satisfies ActionSchema;

export default GetAction;
