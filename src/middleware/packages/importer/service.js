const fs = require('fs').promises;
const path = require('path');
const { ServiceSchemaError, MoleculerError } = require('moleculer').Errors;

const ImporterService = {
  name: 'importer',
  settings: {
    importsDir: null,
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

      const file = await fs.readFile(path.resolve(this.settings.importsDir, fileName));
      let json = JSON.parse(file.toString());

      // If the json is not an array, try to convert an object to an array
      if (!Array.isArray(json)) json = Object.values(json);

      console.log(`Importing ${json.length} items...`);

      for (let data of json) {
        await this.actions[action]({ data, ...otherParams }, { parentCtx: ctx });
      }

      console.log('Import finished !');
    }
  }
};

module.exports = ImporterService;
