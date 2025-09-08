import { ActionSchema } from 'moleculer';

const Schema = {
  visibility: 'public',
  params: {
    containerUri: { type: 'string' }
  },
  async handler(ctx) {
    // Matches container with or without trailing slash
    const containerUri = ctx.params.containerUri.replace(/\/+$/, '');

    return (
      (await ctx.call('triplestore.document.exist', { documentUri: containerUri })) ||
      (await ctx.call('triplestore.document.exist', { documentUri: `${containerUri}/` }))
    );
  }
} satisfies ActionSchema;

export default Schema;
