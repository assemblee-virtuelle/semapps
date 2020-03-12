const { MIME_TYPES } = require('@semapps/mime-types');
const fs = require('fs').promises;
const path = require('path');

const ImporterService = {
  name: 'importer',
  settings: {
    // To be set by user
    baseUri: null,
    baseDir: null,
    usersContainer: null,
    transformData: data => data
  },
  dependencies: ['ldp'],
  actions: {
    async import(ctx) {
      let { fileName, userId } = ctx.params, slug;

      if (!userId.startsWith('http')) userId = this.settings.usersContainer + userId;

      const file = await fs.readFile(path.resolve(this.settings.baseDir, fileName));
      const json = JSON.parse(file.toString());

      for( let data of json ) {
        data = this.settings.transformData(data);

        console.log({
          webId: userId,
          accept: MIME_TYPES.JSON,
          contentType: MIME_TYPES.JSON,
          ...data
        });

        await ctx.call('ldp.post', {
          webId: userId,
          accept: MIME_TYPES.JSON,
          contentType: MIME_TYPES.JSON,
          ...data
        });

        return;
      }
    }
  }
};

module.exports = ImporterService;
