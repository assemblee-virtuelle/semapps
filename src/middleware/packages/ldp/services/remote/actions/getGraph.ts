import rdf from '@rdfjs/data-model';
import { defineAction } from 'moleculer';

const Schema = defineAction({
  visibility: 'public',
  params: {
    resourceUri: { type: 'string' }
  },
  async handler(ctx) {
    const { resourceUri } = ctx.params;

    let exist = await ctx.call('triplestore.tripleExist', {
      triple: rdf.quad(rdf.namedNode(resourceUri), rdf.variable('p'), rdf.variable('s')),
      webId: 'system'
    });

    if (exist) {
      return undefined; // Default graph
    }
    exist = await ctx.call('triplestore.tripleExist', {
      triple: rdf.quad(rdf.namedNode(resourceUri), rdf.variable('p'), rdf.variable('s')),
      graphName: this.settings.mirrorGraphName
    });

    if (exist) {
      return this.settings.mirrorGraphName;
    }
    return false;
  }
});

export default Schema;
