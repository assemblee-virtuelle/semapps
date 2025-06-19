import { triple, namedNode, variable } from '@rdfjs/data-model';
import { defineAction } from 'moleculer';

const Schema = defineAction({
  visibility: 'public',
  params: {
    resourceUri: { type: 'string' }
  },
  async handler(ctx) {
    const { resourceUri } = ctx.params;

    let exist = await ctx.call('triplestore.tripleExist', {
      // @ts-expect-error TS(2345): Argument of type 'NamedNode<string>' is not assign... Remove this comment to see the full error message
      triple: triple(namedNode(resourceUri), variable('p'), variable('s')),
      webId: 'system'
    });

    if (exist) {
      return undefined; // Default graph
    }
    exist = await ctx.call('triplestore.tripleExist', {
      // @ts-expect-error TS(2345): Argument of type 'NamedNode<string>' is not assign... Remove this comment to see the full error message
      triple: triple(namedNode(resourceUri), variable('p'), variable('s')),
      // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
      graphName: this.settings.mirrorGraphName
    });

    if (exist) {
      // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
      return this.settings.mirrorGraphName;
    }
    return false;
  }
});

export default Schema;
