import { defineAction } from 'moleculer';

const Schema = defineAction({
  visibility: 'public',
  params: {
    context: {
      type: 'multi',
      // @ts-expect-error TS(2322): Type '{ type: "array"; }' is not assignable to typ... Remove this comment to see the full error message
      rules: [{ type: 'array' }, { type: 'object' }, { type: 'string' }]
    },
    // @ts-expect-error TS(2322): Type '{ type: "object"; optional: true; }' is not ... Remove this comment to see the full error message
    options: { type: 'object', optional: true }
  },
  async handler(ctx) {
    const { context, options } = ctx.params;
    const { contextRaw } = await this.contextParser.parse(context, options);
    return contextRaw;
  }
});

export default Schema;
