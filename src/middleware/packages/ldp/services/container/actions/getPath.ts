import dashify from 'dashify';
import { isURL } from '../../../utils.ts';
import { ActionSchema } from 'moleculer';

const Schema = {
  visibility: 'public',
  params: {
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
      prefix = matchResults[1];
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
} satisfies ActionSchema;

export default Schema;
