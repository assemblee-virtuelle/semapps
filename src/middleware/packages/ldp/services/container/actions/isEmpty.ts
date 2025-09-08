import { ActionSchema } from 'moleculer';

const Schema = {
  visibility: 'public',
  params: {
    containerUri: { type: 'string' },
    webId: {
      type: 'string',
      optional: true
    }
  },
  async handler(ctx) {
    const { containerUri } = ctx.params;
    // @ts-expect-error TS(2339): Property 'webId' does not exist on type '{}'.
    const webId = ctx.params.webId || ctx.meta.webId || 'anon';
    // @ts-expect-error TS(2339): Property 'dataset' does not exist on type '{}'.
    const { dataset } = ctx.meta;

    const res = await ctx.call('triplestore.query', {
      query: `SELECT (COUNT (?o) as ?count) { <${containerUri}> <http://www.w3.org/ns/ldp#contains> ?o }`,
      webId,
      dataset
    });

    const num = Number(res[0].count.value);
    return num === 0;
  }
} satisfies ActionSchema;

export default Schema;
