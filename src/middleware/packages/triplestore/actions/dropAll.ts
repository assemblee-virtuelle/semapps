import { ActionSchema } from 'moleculer';

const Schema = {
  visibility: 'public',
  params: {
    dataset: {
      type: 'string',
      optional: true
    }
  },
  async handler(ctx) {
    const dataset = ctx.params.dataset || ctx.meta.dataset || this.settings.defaultDataset;

    if (!(await ctx.call('triplestore.dataset.exist', { dataset })))
      throw new Error(`The dataset ${dataset} doesn't exist`);

    return await this.settings.adapter.dropAll(dataset);
  }
} satisfies ActionSchema;

export default Schema;
