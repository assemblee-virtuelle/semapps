const fs = require('fs').promises;
const path = require('path');

const ImporterService = {
  name: 'importer',
  settings: {
    baseUri: null,
    baseDir: null,
    allowedActions: []
  },
  async started() {
    this.settings.allowedActions.forEach(actionName => {
      if (!this.actions[actionName]) {
        throw new ServiceSchemaError(`Missing action "${actionName}" in service settings!`);
      }
    });
  },
  actions: {
    async import(ctx) {
      let { action, fileName, ...otherParams } = ctx.params;

      if (!action || !fileName || !this.settings.allowedActions.includes(action)) {
        throw new MoleculerError('Bad request', 400, 'BAD_REQUEST');
      }

      const file = await fs.readFile(path.resolve(this.settings.baseDir, fileName));
      const json = JSON.parse(file.toString());

      console.log(`Importing ${json.length} items...`);

      for (let data of json) {
        await this.actions[action]({ data, ...otherParams });
      }

      console.log('Import finished !');
    }
  }
};

module.exports = ImporterService;
