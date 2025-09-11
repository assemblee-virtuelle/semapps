import rdf from '@rdfjs/data-model';
import { ActionSchema } from 'moleculer';

const Schema = {
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
      // @ts-expect-error TS(2339): Property 'mirrorGraphName' does not exist on type '... Remove this comment to see the full error message
      graphName: this.settings.mirrorGraphName
    });

    if (exist) {
      // @ts-expect-error TS(2339): Property 'mirrorGraphName' does not exist on type '... Remove this comment to see the full error message
      return this.settings.mirrorGraphName;
    }
    return false;
  }
} satisfies ActionSchema;

export default Schema;
