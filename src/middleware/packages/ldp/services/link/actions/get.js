module.exports = {
  visibility: 'public',
  params: {
    uri: { type: 'string' }
  },
  async handler(ctx) {
    const { uri } = ctx.params;
    let linksArray = [];

    for (const actionName of this.registeredLinks) {
      const { link, params } = await ctx.call(actionName, { uri });

      const paramsString = Object.entries(params)
        .map(([name, value]) => `${name}="${value}"`)
        .join('; ');

      linksArray.push(`<${encodeURI(link)}>; ${paramsString}`);
    }

    return linksArray.join(', ');
  }
};
