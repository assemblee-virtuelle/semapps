export default async function patch(this: any, ctx: any) {
  try {
    const { username, slugParts } = ctx.params;

    const uri = this.getUriFromSlugParts(slugParts, username);
    const types = await ctx.call('ldp.resource.getTypes', { resourceUri: uri });

    if (types.includes('http://www.w3.org/ns/ldp#Container')) {
      await ctx.call('ldp.container.delete', { containerUri: uri });
    } else {
      const { controlledActions } = await ctx.call('ldp.registry.getByUri', { resourceUri: uri });
      await ctx.call(controlledActions.delete || 'ldp.resource.delete', { resourceUri: uri });
    }

    ctx.meta.$statusCode = 204;
    ctx.meta.$responseHeaders = {
      Link: '<http://www.w3.org/ns/ldp#Resource>; rel="type"',
      'Content-Length': 0
    };
  } catch (e) {
    // @ts-expect-error TS(18046): 'e' is of type 'unknown'.
    if (e.code !== 404 && e.code !== 403) console.error(e);
    // @ts-expect-error TS(18046): 'e' is of type 'unknown'.
    ctx.meta.$statusCode = e.code || 500;
    // @ts-expect-error TS(18046): 'e' is of type 'unknown'.
    ctx.meta.$statusMessage = e.message;
  }
}
