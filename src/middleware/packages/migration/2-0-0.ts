import path from 'path';
import fs from 'fs';
import { ServiceSchema } from 'moleculer';
import { IBindings } from 'sparqljson-parse';
import urlJoin from 'url-join';
import { Account } from '@semapps/auth';
import { arrayOf } from '@semapps/ldp';
import { buildBlankNodesQuery, objectCurrentToId, pseudoIdToId } from './utils.ts';
import MigrationService from './service.ts';

const blankNodesQuery = buildBlankNodesQuery(4);

export default {
  name: 'migration-2-0-0',
  mixins: [MigrationService],
  settings: {
    baseUrl: undefined,
    baseDir: undefined
  },
  created() {
    if (!this.settings.baseUrl) throw new Error('The baseUrl setting is mandatory');
    if (!this.settings.baseDir) throw new Error('The baseDir setting is mandatory');
  },
  actions: {
    migrate: {
      async handler(ctx) {
        const { username } = ctx.params;
        const accounts: Account[] = await ctx.call('auth.account.find', {
          query: username === '*' ? undefined : { username }
        });

        for (const { username: dataset } of accounts) {
          this.logger.info(`Migrating storage ${dataset}...`);

          ctx.meta.dataset = dataset;
          ctx.meta.isMigrating = true;
          ctx.meta.skipObjectsWatcher = true; // We don't want to trigger Update activities

          await this.actions.migrateAllContainers({ dataset }, { parentCtx: ctx });
          await this.actions.migrateTypeIndex({ dataset }, { parentCtx: ctx });
          ctx.meta.webId = await this.actions.migrateWebId({ dataset }, { parentCtx: ctx });
          await this.actions.deleteIntermediaryContainers({ dataset }, { parentCtx: ctx });
          await this.actions.migrateCurrentPredicate({ dataset }, { parentCtx: ctx });
          await this.actions.migratePseudoIds({ dataset }, { parentCtx: ctx });
          await this.actions.attachAllContainersToRootContainer({ dataset }, { parentCtx: ctx });
          await this.actions.migrateBinaries({ dataset }, { parentCtx: ctx });

          await this.actions.migrateSingleResourcesContainer(
            {
              oldContainerUri: urlJoin(this.settings.baseUrl, dataset, 'data/pim/configuration-file'),
              types: ['pim:ConfigurationFile'],
              isPrivate: true
            },
            { parentCtx: ctx }
          );
        }
      }
    },
    /**
     * Migrate the WebID (it is not attached to a container)
     */
    migrateWebId: {
      async handler(ctx) {
        const { dataset } = ctx.params;
        ctx.meta.dataset = dataset || ctx.meta.dataset;

        const newWebId = await this.actions.migrateResource(
          {
            oldResourceUri: urlJoin(this.settings.baseUrl, dataset)
          },
          { parentCtx: ctx }
        );

        // Register the single resource in the type index
        await ctx.call('type-index.register', {
          types: ['foaf:Agent'],
          uri: newWebId,
          isContainer: false,
          isPrivate: false
        });

        const account: Account = await ctx.call('auth.account.findByUsername', { username: dataset });
        await ctx.call('auth.account.attachWebId', { accountUri: account['@id'], webId: newWebId });

        return newWebId;
      }
    },
    migrateAllContainers: {
      async handler(ctx) {
        const { dataset } = ctx.params;
        ctx.meta.dataset = dataset || ctx.meta.dataset;

        // Find all containers in default graph
        let result: any = await ctx.call('triplestore.query', {
          query: `
            PREFIX ldp: <http://www.w3.org/ns/ldp#>
            SELECT ?containerUri
            WHERE {
              ?containerUri a ldp:Container .
            }
          `,
          webId: 'system'
        });
        const oldContainersUris = result.map((node: any) => node.containerUri.value);
        let newContainersUris = [];

        for (const oldContainerUri of oldContainersUris) {
          // Move all containers and their resources
          newContainersUris.push(await this.actions.migrateContainer({ oldContainerUri }, { parentCtx: ctx }));
        }

        // Delete tombstones (they are not linked from containers)
        await ctx.call('triplestore.update', {
          query: `
            PREFIX as: <https://www.w3.org/ns/activitystreams#>
            DELETE 
            WHERE {
              ?s1 a as:Tombstone .
              ?s1 ?p1 ?o1 . 
            }
          `,
          webId: 'system'
        });

        // Delete orphan blank nodes from default graph
        await ctx.call('triplestore.update', {
          query: `
            DELETE {
              ?s ?p ?o .
            }
            WHERE {
              ?s ?p ?o .
              FILTER(isBLANK(?s))
              FILTER(NOT EXISTS {?parentS ?parentP ?s})
            }
          `,
          webId: 'system'
        });
      }
    },
    migrateContainer: {
      async handler(ctx) {
        const { oldContainerUri } = ctx.params;

        let newContainerUri = await ctx.call('redirect.get', { oldUri: oldContainerUri });

        if (newContainerUri) {
          this.logger.warn(`Container ${oldContainerUri} is already migrated, skipping...`);
        } else {
          this.logger.info(`Migrating container ${oldContainerUri}...`);

          const container: any = await ctx.call('triplestore.query', {
            query: `
              CONSTRUCT 
              WHERE {
                <${oldContainerUri}> ?p1 ?o1 .
              }
            `,
            webId: 'system'
          });

          const baseUrl = await ctx.call('solid-storage.getBaseUrl');
          newContainerUri = await ctx.call('triplestore.named-graph.create', { baseUrl });

          await ctx.call('triplestore.insert', {
            resource: this.changeId(container, oldContainerUri, newContainerUri),
            graphName: newContainerUri,
            webId: 'system'
          });

          await ctx.call('redirect.set', { oldUri: oldContainerUri, newUri: newContainerUri });

          // Replace all references to resource with new URI
          await this.actions.updateReferences({ oldUri: oldContainerUri, newUri: newContainerUri }, { parentCtx: ctx });
        }

        /**
         * Find resources in container (excluding child container because they are treated independently)
         */

        this.logger.info(`Migrating resources in container ${oldContainerUri}...`);

        const result: any = await ctx.call('triplestore.query', {
          query: `
            PREFIX ldp: <http://www.w3.org/ns/ldp#>
            SELECT ?resourceUri
            WHERE {
              <${oldContainerUri}> ldp:contains ?resourceUri .
              FILTER(NOT EXISTS { ?resourceUri a ldp:Container })
            }
          `,
          webId: 'system'
        });
        const oldResourcesUris = result.map((node: any) => node.resourceUri.value);

        for (const oldResourceUri of oldResourcesUris) {
          if (!(await ctx.call('ldp.remote.isRemote', { resourceUri: oldResourceUri }))) {
            await this.actions.migrateResource({ oldResourceUri }, { parentCtx: ctx });
          }

          // Unlink resource from container (so that they are not migrated twice)
          await ctx.call('triplestore.update', {
            query: `
              PREFIX ldp: <http://www.w3.org/ns/ldp#>
              DELETE
              WHERE {
                <${oldContainerUri}> ldp:contains <${oldResourceUri}>
              }
            `,
            webId: 'system'
          });
        }

        this.logger.info(`Deleting container ${oldContainerUri} from default graph...`);

        // Delete container
        await ctx.call('triplestore.update', {
          query: `
            DELETE
            WHERE {
              <${oldContainerUri}> ?p1 ?s1 .
            }
          `,
          webId: 'system'
        });

        return newContainerUri;
      }
    },
    migrateResource: {
      async handler(ctx) {
        const { oldResourceUri } = ctx.params;

        let newResourceUri = await ctx.call('redirect.get', { oldUri: oldResourceUri });

        if (newResourceUri) {
          this.logger.warn(`Resource ${oldResourceUri} is already migrated, skipping...`);
        } else {
          this.logger.info(`Migrating resource ${oldResourceUri}...`);

          const resource: any = await ctx.call('triplestore.query', {
            query: `
              CONSTRUCT  {
                ${blankNodesQuery.construct}
              }
              WHERE {
                BIND(<${oldResourceUri}> AS ?s1) .
                ${blankNodesQuery.where}
              }
            `,
            webId: 'system'
          });

          if (resource['@type'] === 'http://semapps.org/ns/core#File') {
            // Binaries will be moved in the migrateBinaries action below
            // We don't want to migrate them twice because the RedirectService would not work
            this.logger.info(`Resource ${oldResourceUri} is a binary, skipping...`);
          } else {
            const baseUrl = await ctx.call('solid-storage.getBaseUrl');
            newResourceUri = await ctx.call('triplestore.named-graph.create', { baseUrl });

            await ctx.call('triplestore.insert', {
              resource: this.changeId(resource, oldResourceUri, newResourceUri),
              graphName: newResourceUri,
              webId: 'system'
            });

            await ctx.call('redirect.set', { oldUri: oldResourceUri, newUri: newResourceUri });

            // Replace all references to resource with new URI
            await this.actions.updateReferences({ oldUri: oldResourceUri, newUri: newResourceUri }, { parentCtx: ctx });

            this.logger.info(`Deleting resource ${oldResourceUri} from default graph...`);

            // Delete resource (orphan blank nodes will be deleted at the end)
            await ctx.call('triplestore.update', {
              query: `
                DELETE
                WHERE {
                  <${oldResourceUri}> ?p1 ?s1 .
                }
              `,
              webId: 'system'
            });
          }
        }

        return newResourceUri;
      }
    },
    /**
     * Replace the as:current predicate with the ID
     * Must be called *after* the migrateAllContainers action
     */
    migrateCurrentPredicate: {
      async handler(ctx) {
        const { dataset } = ctx.params;
        ctx.meta.dataset = dataset || ctx.meta.dataset;

        const result: any = await ctx.call('triplestore.query', {
          query: `
            PREFIX as: <https://www.w3.org/ns/activitystreams#>
            SELECT DISTINCT ?resourceUri
            WHERE {
              GRAPH ?resourceUri {
                ?s1 as:current ?current .
              }
            }
          `,
          webId: 'system'
        });
        const activitiesUris = result.map((node: any) => node.resourceUri.value);

        this.logger.info(`Found ${activitiesUris.length} activities needing migration`);

        for (const activityUri of activitiesUris) {
          this.logger.info(`Migrating activity ${activityUri}...`);

          const activity = await ctx.call('activitypub.activity.get', { resourceUri: activityUri });

          const activityWithId = objectCurrentToId(activity);

          if (await ctx.call('ldp.remote.isRemote', { resourceUri: activityUri })) {
            await ctx.call('ldp.remote.store', { resource: activityWithId });
          } else {
            await ctx.call('activitypub.activity.put', { resource: activityWithId });
          }
        }
      }
    },
    /**
     * Replace the as:current predicate with the ID
     * Must be called *after* the migrateAllContainers action
     */
    migratePseudoIds: {
      async handler(ctx) {
        const { dataset } = ctx.params;
        ctx.meta.dataset = dataset || ctx.meta.dataset;

        const result: any = await ctx.call('triplestore.query', {
          query: `
            SELECT DISTINCT ?resourceUri
            WHERE {
              GRAPH ?resourceUri {
                ?s1 <urn:tmp:pseudoId> ?pseudoId .
              }
            }
          `,
          webId: 'system'
        });

        const resourcesUris = result.map((node: any) => node.resourceUri.value);

        this.logger.info(`Found ${resourcesUris.length} resources needing migration`);

        for (const resourceUri of resourcesUris) {
          this.logger.info(`Migrating resource ${resourceUri}...`);

          const resource = await ctx.call('ldp.resource.get', { resourceUri });

          await ctx.call('ldp.resource.put', { resource: pseudoIdToId(resource) });
        }
      }
    },
    /**
     * Migrate the TypeIndex
     * Must be called *after* the migrateAllContainers action
     */
    migrateTypeIndex: {
      async handler(ctx) {
        const { dataset } = ctx.params;
        ctx.meta.dataset = dataset || ctx.meta.dataset;

        for (const isPrivate of [false, true]) {
          const result: any = await ctx.call('triplestore.query', {
            query: `
              PREFIX solid: <http://www.w3.org/ns/solid/terms#>
              SELECT ?typeRegistrationUri
              WHERE {
                GRAPH ?g {
                  ?typeIndexUri a solid:TypeIndex, ${isPrivate ? 'solid:UnlistedDocument' : 'solid:ListedDocument'} .
                  ?typeIndexUri solid:hasTypeRegistration ?typeRegistrationUri .
                }
              }
            `,
            webId: 'system'
          });

          const typeRegistrationsUris = result.map((node: any) => node.typeRegistrationUri.value);

          for (const typeRegistrationUri of typeRegistrationsUris) {
            const typeRegistration: any = await ctx.call('ldp.resource.get', {
              resourceUri: typeRegistrationUri,
              webId: 'system'
            });

            await ctx.call('type-index.register', {
              types: arrayOf(typeRegistration['solid:forClass']),
              uri: typeRegistration['solid:instanceContainer'],
              isContainer: true,
              isPrivate
            });

            await ctx.call('ldp.resource.delete', { resourceUri: typeRegistrationUri, webId: 'system' });

            // Remove the link (in the new type index, we don't use this predicate)
            await ctx.call('triplestore.update', {
              query: `
                PREFIX solid: <http://www.w3.org/ns/solid/terms#>
                DELETE
                WHERE {
                  GRAPH ?g {
                    ?typeIndexUri solid:hasTypeRegistration <${typeRegistrationUri}> .
                  }
                }
              `,
              webId: 'system'
            });
          }
        }

        // Delete type registration container
        const newTypeRegistrationContainerUri = await ctx.call('redirect.get', {
          oldUri: urlJoin(this.settings.baseUrl, ctx.meta.dataset, 'data/solid/type-registration')
        });
        await ctx.call('ldp.container.delete', { containerUri: newTypeRegistrationContainerUri, webId: 'system' });
      }
    },
    /**
     * Delete intermediary containers with ontology prefixes
     * Must be called *after* the migrateAllContainers action
     */
    deleteIntermediaryContainers: {
      async handler(ctx) {
        const { dataset } = ctx.params;
        ctx.meta.dataset = dataset || ctx.meta.dataset;

        const prefixes = ['as', 'foaf', 'vcard', 'interop', 'pim', 'solid', 'semapps', 'notify'];

        for (const prefix of prefixes) {
          const oldUri = urlJoin(this.settings.baseUrl, ctx.meta.dataset, 'data', prefix);

          // Find the new URI
          const newUri = await ctx.call('redirect.get', { oldUri });

          if (newUri) {
            // Delete the container (and detach it from the root container)
            await ctx.call('ldp.container.delete', { containerUri: newUri, webId: 'system' });
          } else {
            this.logger.warn(`No new URI found for container ${oldUri}, ignoring...`);
          }
        }
      }
    },
    /**
     * Migrate deprecated SingleResourceContainerMixin to ControlledResourceMixin
     */
    migrateSingleResourcesContainer: {
      params: {
        oldContainerUri: { type: 'string' },
        types: { type: 'array' },
        isPrivate: { type: 'boolean' }
      },
      async handler(ctx) {
        const { oldContainerUri, types, isPrivate } = ctx.params;

        this.logger.info(`Migrating ${oldContainerUri} (types: ${types.join(', ')}) to controlled resource...`);

        const rootContainerUri = await ctx.call('solid-storage.getRootContainerUri');

        const newContainerUri = await ctx.call('redirect.get', { oldUri: oldContainerUri });

        const resourcesUris: string[] = await ctx.call('ldp.container.getUris', { containerUri: newContainerUri });

        if (resourcesUris.length === 1) {
          // Attach the resource directly to the root container
          await ctx.call('ldp.container.attach', {
            containerUri: rootContainerUri,
            resourceUri: resourcesUris[0],
            webId: 'system'
          });

          // Register the single resource in the type index
          await ctx.call('type-index.register', {
            types,
            uri: resourcesUris[0],
            isContainer: false,
            isPrivate
          });

          // Delete the container
          await ctx.call('ldp.container.delete', { containerUri: newContainerUri });
        } else {
          this.logger.warn(
            `Single resource container ${newContainerUri} has ${resourcesUris.length} resources. Expecting 1.`
          );
        }
      }
    },
    /**
     * Must be called *after* the migrateAllContainers action
     */
    attachAllContainersToRootContainer: {
      async handler(ctx) {
        const { dataset } = ctx.params;
        ctx.meta.dataset = dataset || ctx.meta.dataset;

        const rootContainerUri: string = await ctx.call('solid-storage.getRootContainerUri');
        const containersUris: string[] = await ctx.call('ldp.container.getAll');

        for (const containerUri of containersUris) {
          if (containerUri !== rootContainerUri) {
            await ctx.call('ldp.container.attach', { containerUri: rootContainerUri, resourceUri: containerUri });
          }
        }
      }
    },
    /**
     * Must be called *after* the migrateAllContainers action
     */
    migrateBinaries: {
      async handler(ctx) {
        const { dataset } = ctx.params;
        ctx.meta.dataset = dataset || ctx.meta.dataset;

        // Files have not been moved to the named graph (we skipped them in the migrateResource action)
        const results: IBindings[] = await ctx.call('triplestore.query', {
          query: `
            PREFIX semapps: <http://semapps.org/ns/core#>
            SELECT ?fileUri ?localPath ?mimeType
            WHERE {
              ?fileUri a semapps:File .
              ?fileUri semapps:localPath ?localPath .
              ?fileUri semapps:mimeType ?mimeType .
            }
          `,
          webId: 'system'
        });

        for (const result of results) {
          const oldFileUri = result.fileUri.value;
          const localPath = result.localPath.value;
          const mimeType = result.mimeType.value;

          this.logger.info(`Migrating file ${oldFileUri}...`);

          const oldFilePath = path.join(this.settings.baseDir, localPath);
          const stream = fs.createReadStream(oldFilePath);

          const newFileUri = await ctx.call('ldp.binary.store', { stream, mimeType });

          await ctx.call('redirect.set', { oldUri: oldFileUri, newUri: newFileUri });

          await this.actions.updateReferences({ oldUri: oldFileUri, newUri: newFileUri }, { parentCtx: ctx });

          fs.unlinkSync(oldFilePath);

          // Delete the old file from the default graph
          await ctx.call('triplestore.update', {
            query: `
              DELETE
              WHERE {
                <${oldFileUri}> ?p1 ?s1 .
              }
            `,
            webId: 'system'
          });
        }
      }
    }
  },
  methods: {
    changeId(resource: any, oldId: string, newId: string) {
      const newResource = { ...resource };
      if (resource['@graph']) {
        // If the resource is a graph, change the URI of the node matching the oldId
        newResource['@graph'] = resource['@graph'].map((node: any) => {
          const newNode = { ...node };
          if (node['@id'] === oldId) newNode['@id'] = newId;
          return newNode;
        });
      } else if (resource['@id'] === oldId) {
        newResource['@id'] = newId;
      }
      return newResource;
    }
  }
} satisfies ServiceSchema;
