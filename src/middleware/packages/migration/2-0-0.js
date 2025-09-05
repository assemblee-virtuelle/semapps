const urlJoin = require('url-join');
const { buildBlankNodesQuery, objectCurrentToId } = require('./utils');

const blankNodesQuery = buildBlankNodesQuery(4);

module.exports = {
  name: 'migration-2-0-0',
  settings: {
    baseUrl: undefined,
    podProvider: false
  },
  created() {
    if (!this.settings.baseUrl) {
      throw new Error('The baseUrl setting is mandatory');
    }
  },
  actions: {
    async moveAllToNamedGraph(ctx) {
      const { dataset } = ctx.params;

      ctx.meta.dataset = dataset || ctx.meta.dataset;

      // Find all containers in default graph
      const result = await ctx.call('triplestore.query', {
        query: `
          PREFIX ldp: <http://www.w3.org/ns/ldp#>
          SELECT ?containerUri
          WHERE {
            ?containerUri a ldp:Container .
          }
        `,
        webId: 'system'
      });
      const containersUris = result.map(node => node.containerUri.value);

      for (const containerUri of containersUris) {
        // Delete all containers and their resources
        await this.actions.moveContainerToNamedGraph({ containerUri }, { parentCtx: ctx });
      }

      if (this.settings.podProvider) {
        // Move WebID (not linked from a container)
        const webId = urlJoin(this.settings.baseUrl, ctx.meta.dataset);
        await this.actions.moveResourceToNamedGraph({ resourceUri: webId }, { parentCtx: ctx });
      }

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
    },
    async moveContainerToNamedGraph(ctx) {
      const { containerUri } = ctx.params;

      const containerExist = await ctx.call('triplestore.document.exist', { documentUri: containerUri });

      if (containerExist) {
        this.logger.warn(`Container ${containerUri} is already in a named graph, skipping...`);
      } else {
        this.logger.info(`Migrating container ${containerUri}...`);

        const container = await ctx.call('triplestore.query', {
          query: `
            CONSTRUCT 
            WHERE {
              <${containerUri}> ?p1 ?o1 .
            }
          `,
          webId: 'system'
        });

        await ctx.call('triplestore.document.create', { documentUri: containerUri });
        await ctx.call('triplestore.insert', {
          resource: container,
          graphName: containerUri,
          webId: 'system'
        });
      }

      /**
       * Find resources in container (excluding child container)
       */

      this.logger.info(`Migrating resources in container ${containerUri}...`);

      const result = await ctx.call('triplestore.query', {
        query: `
          PREFIX ldp: <http://www.w3.org/ns/ldp#>
          SELECT ?resourceUri
          WHERE {
            <${containerUri}> ldp:contains ?resourceUri .
            FILTER(NOT EXISTS { ?resourceUri a ldp:Container })
          }
        `,
        webId: 'system'
      });
      const resourcesUris = result.map(node => node.resourceUri.value);

      for (const resourceUri of resourcesUris) {
        await this.actions.moveResourceToNamedGraph({ resourceUri }, { parentCtx: ctx });

        // Unlink resource from container
        await ctx.call('triplestore.update', {
          query: `
            PREFIX ldp: <http://www.w3.org/ns/ldp#>
            DELETE
            WHERE {
              <${containerUri}> ldp:contains <${resourceUri}>
            }
          `,
          webId: 'system'
        });
      }

      this.logger.info(`Deleting container ${containerUri} from default graph...`);

      // Delete container
      await ctx.call('triplestore.update', {
        query: `
          DELETE
          WHERE {
            <${containerUri}> ?p1 ?s1 .
          }
        `,
        webId: 'system'
      });
    },
    async moveResourceToNamedGraph(ctx) {
      const { resourceUri } = ctx.params;

      const resourceExist = await ctx.call('triplestore.document.exist', { documentUri: resourceUri });

      if (resourceExist) {
        this.logger.warn(`Resource ${resourceUri} is already in a named graph, skipping...`);
      } else {
        this.logger.info(`Migrating resource ${resourceUri}...`);

        const resource = await ctx.call('triplestore.query', {
          query: `
            CONSTRUCT  {
              ${blankNodesQuery.construct}
            }
            WHERE {
              BIND(<${resourceUri}> AS ?s1) .
              ${blankNodesQuery.where}
            }
          `,
          webId: 'system'
        });

        await ctx.call('triplestore.document.create', { documentUri: resourceUri });
        await ctx.call('triplestore.insert', {
          resource,
          graphName: resourceUri,
          webId: 'system'
        });
      }

      this.logger.info(`Deleting resource ${resourceUri} from default graph...`);

      // Delete resource (orphan blank nodes will be deleted at the end)
      await ctx.call('triplestore.update', {
        query: `
          DELETE
          WHERE {
            <${resourceUri}> ?p1 ?s1 .
          }
        `,
        webId: 'system'
      });
    },
    /**
     * Replace the as:current predicate with the ID
     * Must be called *after* the moveAllToNamedGraph action
     */
    async migrateCurrentPredicate(ctx) {
      const { dataset } = ctx.params;

      ctx.meta.dataset = dataset || ctx.meta.dataset;
      if (this.settings.podProvider) ctx.meta.webId = urlJoin(this.settings.baseUrl, ctx.meta.dataset);

      const result = await ctx.call('triplestore.query', {
        query: `
          PREFIX as: <https://www.w3.org/ns/activitystreams#>
          SELECT ?resourceUri
          WHERE {
            GRAPH ?resourceUri {
              ?s1 as:current ?current .
            }
          }
        `,
        webId: 'system'
      });
      const activitiesUris = result.map(node => node.resourceUri.value);

      this.logger.info(`Found ${activitiesUris.length} activities needing migration`);

      for (const activityUri of activitiesUris) {
        this.logger.info(`Migrating activity ${activityUri}...`);

        const activity = await ctx.call('activitypub.activity.get', { resourceUri: activityUri });

        console.log('before', activity);

        const activityWithId = objectCurrentToId(activity);

        console.log('after', activityWithId);

        if (await ctx.call('ldp.remote.isRemote', { resourceUri: activityUri })) {
          await ctx.call('ldp.remote.store', {
            resource: activityWithId,
            webId: ctx.meta.webId,
            dataset: ctx.meta.dataset
          });
        } else {
          await ctx.call('activitypub.activity.put', { resource: activityWithId });
        }
      }
    }
  }
};
