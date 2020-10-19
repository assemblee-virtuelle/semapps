const { MIME_TYPES } = require('@semapps/mime-types');

module.exports = {
  name: 'external-resource',
  actions: {
    getOne: {
      cache: true,
      async handler(ctx) {
        const { id } = ctx.params;
        const response = await fetch(id, { headers: { Accept: MIME_TYPES.JSON } });
        if (response.ok) {
          return await response.json();
        } else {
          return null;
        }
      }
    },
    getMany: {
      cache: true,
      async handler(ctx) {
        let { ids } = ctx.params;
        let resources = [];
        ids = Array.isArray(ids) ? ids : [ids];
        for (let id of ids) {
          const resource = await this.actions.getOne({ id });
          if (resource) resources.push(resource);
        }
        return resources;
      }
    }
  }
};
