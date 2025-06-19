import { defineAction } from 'moleculer';
import { isURL } from '../utils.ts';

const regexPrefix = /^([^:]+):([^:]+)$/gm;

const Schema = defineAction({
  visibility: 'public',
  params: {
    // @ts-expect-error TS(2769): No overload matches this call.
    value: 'string'
  },
  cache: true,
  async handler(ctx) {
    const { value } = ctx.params;

    // Check if this is already a full URI
    if (isURL(value)) return value;

    // @ts-expect-error TS(2339): Property 'match' does not exist on type 'never'.
    if (!value.match(regexPrefix)) throw new Error(`The provided value ${value} is neither prefixed, nor a full URI`);

    const matchResults = regexPrefix.exec(value);
    // @ts-expect-error TS(18047): 'matchResults' is possibly 'null'.
    const prefix = matchResults[1];

    // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
    const ontology = await this.actions.get({ prefix });
    if (!ontology) throw new Error(`No ontology found with prefix ${prefix}`);

    // @ts-expect-error TS(2339): Property 'replace' does not exist on type 'never'.
    return value.replace(`${ontology.prefix}:`, ontology.namespace);
  }
});

export default Schema;
