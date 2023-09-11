const { MIME_TYPES } = require('@semapps/mime-types');
const { defaultToArray } = require('../../utils');

module.exports =  {
  settings: {
    disassembly: [] // Example: [{ path: 'pair:hasLocation', container: 'http://localhost:3000/places' }]
  },
  started(ctx) {
    if (disassembly.length === 0) {
      throw new Error('The disassembly config of the DisassemblyMixin is missing')
    }
  },
  hooks: {
    before: {
      async create(ctx) {
        const { resource, contentType } = ctx.params;
        if (contentType === MIME_TYPES.JSON) {
          await this.createDisassembly(ctx, resource);
        }
      },
      async put(ctx) {
        const { resource, contentType } = ctx.params;
        if (contentType === MIME_TYPES.JSON) {
          const oldData = await ctx.call('ldp.resource.get', {
            resourceUri: resource.id || resource['@id'],
            accept: MIME_TYPES.JSON,
            webId: 'system'
          });
          await this.updateDisassembly(ctx, resource, oldData);
        }
      }
    },
    after: {
      async delete(ctx, res) {
        await this.deleteDisassembly(ctx, res.oldData);
        return res;
      }
    }
  },
  methods: {
    async createDisassembly(ctx, newData) {
      for (let disassemblyConfig of this.settings.disassembly) {
        if (newData[disassemblyConfig.path]) {
          let disassemblyValue = newData[disassemblyConfig.path];
          if (!Array.isArray(disassemblyValue)) {
            disassemblyValue = [disassemblyValue];
          }
          const uriAdded = [];
          for (let resource of disassemblyValue) {
            let { id, ...resourceWithoutId } = resource;
            const newResourceUri = await ctx.call('ldp.container.post', {
              containerUri: disassemblyConfig.container,
              resource: {
                '@context': newData['@context'],
                ...resourceWithoutId
              },
              contentType: MIME_TYPES.JSON,
              webId: 'system'
            });
            uriAdded.push({ '@id': newResourceUri, '@type': '@id' });
          }
          newData[disassemblyConfig.path] = uriAdded;
        }
      }
    },
    async updateDisassembly(ctx, newData, oldData) {
      for (let disassemblyConfig of this.settings.disassembly) {
        let uriAdded = [],
          uriRemoved = [],
          uriKept = [];
  
        let oldDisassemblyValue = defaultToArray(oldData[disassemblyConfig.path]) || [];
        let newDisassemblyValue = defaultToArray(newData[disassemblyConfig.path]) || [];
  
        let resourcesToAdd = newDisassemblyValue.filter(
          t1 => !oldDisassemblyValue.some(t2 => (t1.id || t1['@id']) === (t2.id || t2['@id']))
        );
        let resourcesToRemove = oldDisassemblyValue.filter(
          t1 => !newDisassemblyValue.some(t2 => (t1.id || t1['@id']) === (t2.id || t2['@id']))
        );
        let resourcesToKeep = oldDisassemblyValue.filter(t1 =>
          newDisassemblyValue.some(t2 => (t1.id || t1['@id']) === (t2.id || t2['@id']))
        );
  
        if (resourcesToAdd) {
          for (let resource of resourcesToAdd) {
            delete resource.id;
  
            const newResourceUri = await ctx.call('ldp.container.post', {
              containerUri: disassemblyConfig.container,
              resource: {
                '@context': newData['@context'],
                ...resource
              },
              contentType: MIME_TYPES.JSON,
              webId: 'system'
            });
            uriAdded.push({ '@id': newResourceUri, '@type': '@id' });
          }
        }
  
        if (resourcesToRemove) {
          for (let resource of resourcesToRemove) {
            await ctx.call('ldp.resource.delete', {
              resourceUri: resource['@id'] || resource['id'] || resource,
              webId: 'system'
            });
            uriRemoved.push({ '@id': resource['@id'] || resource['id'] || resource, '@type': '@id' });
          }
        }

        if (resourcesToKeep) {
          uriKept = resourcesToKeep.map(r => ({ '@id': r['@id'] || r.id || r, '@type': '@id' }));
        }
  
        oldData[disassemblyConfig.path] = [...uriRemoved, ...uriKept];
        newData[disassemblyConfig.path] = [...uriKept, ...uriAdded];
      }
    },
    async deleteDisassembly(ctx, oldData) {
      for (let disassemblyConfig of this.settings.disassembly) {
        if (oldData[disassemblyConfig.path]) {
          let disassemblyValue = oldData[disassemblyConfig.path];
          if (!Array.isArray(disassemblyValue)) {
            disassemblyValue = [disassemblyValue];
          }
          for (let resource of disassemblyValue) {
            await ctx.call('ldp.resource.delete', {
              resourceUri: resource['@id'] || resource['id'] || resource,
              webId: 'system'
            });
          }
        }
      }
    },
  }
}