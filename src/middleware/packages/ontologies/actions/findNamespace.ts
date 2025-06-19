// @ts-expect-error TS(7016): Could not find a declaration file for module 'node... Remove this comment to see the full error message
import fetch from 'node-fetch';
import { defineAction } from 'moleculer';

const Schema = defineAction({
  visibility: 'public',
  params: {
    // @ts-expect-error TS(2769): No overload matches this call.
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
});

export default Schema;
