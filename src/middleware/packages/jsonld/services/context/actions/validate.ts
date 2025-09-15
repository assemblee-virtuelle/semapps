import { ActionSchema } from 'moleculer';

const Schema = {
  visibility: 'public',
  params: {
    context: {
      type: 'multi',
      // @ts-expect-error TS(2322): Type '{ type: "array"; }' is not assignable to typ... Remove this comment to see the full error message
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
} satisfies ActionSchema;

export default Schema;
