import fetch from 'node-fetch';
import { ActionSchema } from 'moleculer';

const Schema = {
  visibility: 'public',
  params: {
    // @ts-expect-error TS(2322): Type 'string' is not assignable to type 'Parameter... Remove this comment to see the full error message
    prefix: 'string'
  },
  async handler(ctx) {
    const { prefix } = ctx.params;

    const response = await fetch(`http://prefix.cc/${prefix}.file.json`);

    if (response.ok) {
      const json = await response.json();

      return json && json[prefix];
    }

    return null;
  }
} satisfies ActionSchema;

export default Schema;
