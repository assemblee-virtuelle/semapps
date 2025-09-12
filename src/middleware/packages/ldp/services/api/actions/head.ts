export default async function head(this: any, ctx: any) {
  try {
    const { username, slugParts } = ctx.params;
    const uri = this.getUriFromSlugParts(slugParts, username);

    const linkHeader = await ctx.call('ldp.link-header.get', { uri });

    ctx.meta.$statusCode = 200;
    ctx.meta.$statusMessage = 'OK';
    ctx.meta.$responseHeaders = {
      Link: linkHeader,
      'Content-Length': 0
    };
  } catch (e) {
    // @ts-expect-error TS(18046): 'e' is of type 'unknown'.
    if (!e.code || (e.code < 400 && e.code >= 500)) console.error(e);
    // @ts-expect-error TS(18046): 'e' is of type 'unknown'.
    ctx.meta.$statusCode = e.code || 500;
    // @ts-expect-error TS(18046): 'e' is of type 'unknown'.
    ctx.meta.$statusMessage = e.message;
  }
}
