import { isURL } from '../utils.ts';
const regexPrefix = /^([^:]+):([^:]+)$/gm;

const Schema = {
  visibility: 'public',
  params: {
    value: 'string'
  },
  cache: true,
  async handler(ctx) {
    const { value } = ctx.params;

    // Check if this is already a full URI
    if (isURL(value)) return value;

    if (!value.match(regexPrefix)) throw new Error(`The provided value ${value} is neither prefixed, nor a full URI`);

    const matchResults = regexPrefix.exec(value);
    const prefix = matchResults[1];

    const ontology = await this.actions.get({ prefix });
    if (!ontology) throw new Error(`No ontology found with prefix ${prefix}`);

    return value.replace(`${ontology.prefix}:`, ontology.namespace);
  }
};

export default Schema;
