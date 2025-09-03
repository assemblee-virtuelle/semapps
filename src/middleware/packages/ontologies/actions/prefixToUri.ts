import { ActionSchema } from 'moleculer';
import { isURL } from '../utils.ts';

const regexPrefix = /^([^:]+):([^:]+)$/gm;

const Schema = {
  visibility: 'public',
  params: {
    // @ts-expect-error TS(2322): Type 'string' is not assignable to type 'Parameter... Remove this comment to see the full error message
    value: 'string'
  },
  cache: true,
  async handler(ctx) {
    const { value } = ctx.params;

    // Check if this is already a full URI
    if (isURL(value)) return value;

    if (!value.match(regexPrefix)) throw new Error(`The provided value ${value} is neither prefixed, nor a full URI`);

    const matchResults = regexPrefix.exec(value);
    // @ts-expect-error TS(18047): 'matchResults' is possibly 'null'.
    const prefix = matchResults[1];

    const ontology = await this.actions.get({ prefix });
    if (!ontology) throw new Error(`No ontology found with prefix ${prefix}`);

    return value.replace(`${ontology.prefix}:`, ontology.namespace);
  }
} satisfies ActionSchema;

export default Schema;
