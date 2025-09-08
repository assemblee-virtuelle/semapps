import { ServiceSchema } from 'moleculer';
import { arrayOf } from '../utils.ts';

const Schema = {
  settings: {
    disassembly: [] // Example: [{ path: 'pair:hasLocation', container: 'http://localhost:3000/places' }]
  },
  started() {
    if (this.settings.disassembly.length === 0) {
      throw new Error('The disassembly config of the DisassemblyMixin is missing');
    }
  },
  hooks: {
    before: {
      async create(ctx) {
        const { resource } = ctx.params;
        await this.createDisassembly(ctx, resource);
      },
      async put(ctx) {
        const { resource } = ctx.params;
        const oldData = await ctx.call('ldp.resource.get', {
          resourceUri: resource.id || resource['@id'],
          webId: 'system'
        });
        await this.updateDisassembly(ctx, resource, oldData);
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
      for (const disassemblyConfig of this.settings.disassembly) {
        if (newData[disassemblyConfig.path]) {
          let disassemblyValue = newData[disassemblyConfig.path];
          if (!Array.isArray(disassemblyValue)) {
            disassemblyValue = [disassemblyValue];
          }
          const uriAdded = [];
          for (const resource of disassemblyValue) {
            const { id, ...resourceWithoutId } = resource;
            const newResourceUri = await ctx.call('ldp.container.post', {
              containerUri: disassemblyConfig.container,
              resource: {
                '@context': newData['@context'],
                ...resourceWithoutId
              },
              webId: 'system'
            });
            uriAdded.push({ '@id': newResourceUri, '@type': '@id' });
          }
          newData[disassemblyConfig.path] = uriAdded;
        }
      }
    },
    async updateDisassembly(ctx, newData, oldData) {
      for (const disassemblyConfig of this.settings.disassembly) {
        const uriAdded = [];
        const uriRemoved = [];
        let uriKept: any = [];

        const oldDisassemblyValue = arrayOf(oldData[disassemblyConfig.path]);
        const newDisassemblyValue = arrayOf(newData[disassemblyConfig.path]);

        const resourcesToAdd = newDisassemblyValue.filter(
          t1 => !oldDisassemblyValue.some(t2 => (t1.id || t1['@id']) === t2)
        );
        const resourcesToRemove = oldDisassemblyValue.filter(
          t1 => !newDisassemblyValue.some(t2 => t1 === (t2.id || t2['@id']))
        );

        const resourcesToKeep = newDisassemblyValue.filter(t1 =>
          oldDisassemblyValue.some(t2 => (t1.id || t1['@id']) === t2)
        );

        if (resourcesToAdd) {
          for (const resource of resourcesToAdd) {
            delete resource.id;
            const newResourceUri = await ctx.call('ldp.container.post', {
              containerUri: disassemblyConfig.container,
              resource: {
                '@context': newData['@context'],
                ...resource
              },
              webId: 'system'
            });
            uriAdded.push({ '@id': newResourceUri, '@type': '@id' });
          }
        }

        if (resourcesToRemove) {
          for (const resource of resourcesToRemove) {
            try {
              await ctx.call('ldp.resource.delete', {
                resourceUri: resource['@id'] || resource.id || resource,
                webId: 'system'
              });
            } catch (error) {
              this.logger.warn(`${resource} Not found during disassembly`);
            }
            uriRemoved.push({ '@id': resource['@id'] || resource.id || resource, '@type': '@id' });
          }
        }

        if (resourcesToKeep) {
          for (const resource of resourcesToKeep) {
            try {
              await ctx.call('ldp.resource.put', {
                resourceUri: resource['@id'] || resource.id || resource,
                resource: {
                  '@context': newData['@context'],
                  ...resource
                },
                webId: 'system'
              });
            } catch (error) {
              this.logger.warn(`${resource} Not found during disassembly`);
            }
          }
          uriKept = resourcesToKeep.map(r => ({ '@id': r['@id'] || r.id || r, '@type': '@id' }));
        }

        oldData[disassemblyConfig.path] = [...uriRemoved, ...uriKept];
        newData[disassemblyConfig.path] = [...uriKept, ...uriAdded];
      }
    },
    async deleteDisassembly(ctx, oldData) {
      for (const disassemblyConfig of this.settings.disassembly) {
        if (oldData[disassemblyConfig.path]) {
          let disassemblyValue = oldData[disassemblyConfig.path];
          if (!Array.isArray(disassemblyValue)) {
            disassemblyValue = [disassemblyValue];
          }
          for (const resource of disassemblyValue) {
            await ctx.call('ldp.resource.delete', {
              resourceUri: resource['@id'] || resource.id || resource,
              webId: 'system'
            });
          }
        }
      }
    }
  }
} satisfies Partial<ServiceSchema>;

export default Schema;
