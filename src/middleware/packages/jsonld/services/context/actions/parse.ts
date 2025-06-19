import { defineAction } from 'moleculer';

const Schema = defineAction({
  visibility: 'public',
  params: {
    context: {
      type: 'multi',
      rules: [{ type: 'array' }, { type: 'object' }, { type: 'string' }]
    },
    options: { type: 'object', optional: true }
  },
  async handler(ctx) {
    const { context, options } = ctx.params;
    // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
    const { contextRaw } = await this.contextParser.parse(context, options);
    return contextRaw;
  }
});

export default Schema;
