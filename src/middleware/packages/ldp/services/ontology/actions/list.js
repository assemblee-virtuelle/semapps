const { isURL } = require('../../../utils');

module.exports = {
  visibility: 'public',
  cache: true,
  async handler(ctx) {
    if (this.settings.dynamicRegistration) {
      const ontologies = await this._list(ctx, {});

      return ontologies.rows.map(({ prefix, url, owl, jsonldContext, preserveContextUri }) => {
        if (!isURL(jsonldContext)) {
          // If the jsonldContext is not an URL, it is an object to be parsed
          jsonldContext = JSON.parse(jsonldContext);
        }

        if (preserveContextUri === 'true') {
          preserveContextUri = true;
        } else if (preserveContextUri === 'false') {
          preserveContextUri = false;
        }

        return { prefix, url, owl, jsonldContext, preserveContextUri };
      });
    } else {
      return this.settings.ontologies;
    }
  }
};
