module.exports = async function patch(ctx) {
  try {
    const { username, slugParts } = ctx.params;
    const uri = this.getUriFromSlugParts(slugParts, username);

    const links = await ctx('ldp.link.get', { uri });

    ctx.meta.$statusCode = 200;
    ctx.meta.$statusMessage = 'OK';
    ctx.meta.$responseHeaders = {
      Link: links,
      'Content-Length': 0
    };
  } catch (e) {
    if (e.code !== 404 && e.code !== 403) console.error(e);
    ctx.meta.$statusCode = e.code || 500;
    ctx.meta.$statusMessage = e.message;
  }
};
