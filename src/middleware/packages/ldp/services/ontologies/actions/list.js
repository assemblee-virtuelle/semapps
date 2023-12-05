module.exports = {
  visibility: 'public',
  params: {},
  async handler(ctx) {
    const ontologies = await this._list(ctx, { sort: 'prefix' });

    return ontologies.rows.map(({ prefix, url, owl, jsonldContext }) => {
      if (!jsonldContext.startsWith('http')) {
        // If the jsonldContext is not an URL, it is an object to be parsed
        jsonldContext = JSON.parse(jsonldContext);
      }

      return { prefix, url, owl, jsonldContext };
    });
  }
};
