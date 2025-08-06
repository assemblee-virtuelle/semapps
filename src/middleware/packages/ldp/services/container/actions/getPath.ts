// @ts-expect-error TS(7016): Could not find a declaration file for module 'dash... Remove this comment to see the full error message
import dashify from 'dashify';
import { defineAction } from 'moleculer';
import { isURL } from '../../../utils.ts';

const Schema = defineAction({
  visibility: 'public',
  params: {
    // @ts-expect-error TS(2322): Type 'string' is not assignable to type 'Parameter... Remove this comment to see the full error message
    resourceType: 'string'
  },
  async handler(ctx) {
    const { resourceType } = ctx.params;
    let ontology;
    let prefix;
    let className;

    // Match a string of type ldp:Container
    const regex = /^([^:]+):([^:]+)$/gm;

    if (isURL(resourceType)) {
      ontology = await ctx.call('ontologies.get', { uri: resourceType });
      if (ontology) {
        prefix = ontology.prefix;
        className = resourceType.replace(ontology.namespace, '');
      }
    } else if (resourceType.match(regex)) {
      const matchResults = regex.exec(resourceType);
      // @ts-expect-error TS(18047): 'matchResults' is possibly 'null'.
      prefix = matchResults[1];
      // @ts-expect-error TS(18047): 'matchResults' is possibly 'null'.
      className = matchResults[2];
      ontology = await ctx.call('ontologies.get', { prefix });
    } else {
      throw new Error(`The resourceType must an URI or prefixed type. Provided: ${resourceType}`);
    }

    if (!ontology) {
      throw new Error(`No registered ontology found for resourceType ${resourceType}`);
    }

    return `/${prefix}/${dashify(className)}`;
  }
});

export default Schema;
