import { defineAction } from 'moleculer';

const Schema = defineAction({
  visibility: 'public',
  params: {
    context: {
      type: 'multi',
      rules: [{ type: 'array' }, { type: 'object' }, { type: 'string' }]
    }
  },
  async handler(ctx) {
    const { context } = ctx.params;
    try {
      // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
      await this.contextParser.parse(context);
      return true;
    } catch (e) {
      // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
      this.logger.warn(`Could not parse context. Error: ${e.message}`);
      return false;
    }
  }
});

export default Schema;
