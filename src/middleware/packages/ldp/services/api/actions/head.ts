export default async function head(ctx) {
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
    if (e.code !== 404 && e.code !== 403) console.error(e);
    ctx.meta.$statusCode = e.code || 500;
    ctx.meta.$statusMessage = e.message;
  }
}
