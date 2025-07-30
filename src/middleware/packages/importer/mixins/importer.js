const fetch = require('node-fetch');
const cronParser = require('cron-parser');
const { promises: fsPromises } = require('fs');
const { ACTIVITY_TYPES, PUBLIC_URI } = require('@semapps/activitypub');
const { MIME_TYPES } = require('@semapps/mime-types');
const { isDir } = require('../utils');

module.exports = {
  settings: {
    source: {
      apiUrl: null,
      getAllFull: null,
      getAllCompact: null,
      getOneFull: null,
      headers: {
        Accept: 'application/json',
        'User-Agent': 'SemAppsImporter'
      },
      basicAuth: {
        user: '',
        password: ''
      },
      fetchOptions: {},
      fieldsMapping: {
        slug: null,
        created: null,
        updated: null
      }
    },
    dest: {
      containerUri: null,
      predicatesToKeep: [] // Don't remove these predicates when updating data
    },
    activitypub: {
      actorUri: null,
      activities: [ACTIVITY_TYPES.CREATE, ACTIVITY_TYPES.UPDATE, ACTIVITY_TYPES.DELETE]
    },
    cronJob: {
      time: null,
      timeZone: 'Europe/Paris'
    }
  },
  dependencies: ['triplestore'],
  created() {
    if (this.settings.source.basicAuth.user) {
      this.settings.source.headers.Authorization = `Basic ${Buffer.from(
        `${this.settings.source.basicAuth.user}:${this.settings.source.basicAuth.password}`
      ).toString('base64')}`;
    }

    // Configure the queue here so that the queue can be named after the service name
    this.schema.queues = {
      [this.name]: {
        name: 'synchronize',
        process: this.processSynchronize
      }
    };
  },
  async started() {
    if (this.settings.source.apiUrl) {
      const result = await this.broker.call('triplestore.query', {
        query: `
          PREFIX dc: <http://purl.org/dc/terms/>
          SELECT ?id ?sourceUri
          WHERE {
            ?id dc:source ?sourceUri.
            FILTER STRSTARTS(STR(?sourceUri), "${this.settings.source.apiUrl}")
          }
        `,
        accept: MIME_TYPES.JSON,
        webId: 'system'
      });

      this.imported = Object.fromEntries(result.map(node => [node.sourceUri.value, node.id.value]));
    } else {
      this.imported = {};
    }

    if (this.settings.cronJob.time && this.createJob) {
      // See https://github.com/OptimalBits/bull/blob/master/REFERENCE.md#queueadd
      this.createJob(
        this.name,
        'synchronize',
        {},
        {
          // Try again after 3 minutes and until 12 hours later
          attempts: 8,
          backoff: { type: 'exponential', delay: '180000' },
          repeat: { cron: this.settings.cronJob.time, tz: this.settings.cronJob.timeZone }
        }
      );
    }
  },
  actions: {
    async freshImport(ctx) {
      if (ctx.params.clear === undefined || ctx.params.clear === true) {
        this.logger.info('Clearing all existing data...');

        await this.actions.deleteImported();
      }

      await this.prepare();

      if (this.settings.source.getAllCompact) {
        this.logger.info('Fetching compact list...');

        const compactResults = await this.list(this.settings.source.getAllCompact);

        if (compactResults) {
          this.logger.info(
            `Importing ${compactResults.length} items from ${
              typeof this.settings.source.getAllCompact === 'string'
                ? this.settings.source.getAllCompact
                : this.settings.source.getAllCompact.url
            }...`
          );

          for (const data of compactResults) {
            const sourceUri = this.settings.source.getOneFull(data);
            const destUri = await this.actions.importOne({ sourceUri }, { parentCtx: ctx });
            if (destUri) this.imported[sourceUri] = destUri;
          }
        } else {
          throw new Error(
            `Error fetching the endpoint ${
              typeof this.settings.source.getAllCompact === 'string'
                ? this.settings.source.getAllCompact
                : this.settings.source.getAllCompact.url
            }...`
          );
        }
      } else if (this.settings.source.getAllFull) {
        this.logger.info('Fetching full list...');

        const fullResults = await this.list(this.settings.source.getAllFull);

        if (fullResults) {
          this.logger.info(
            `Importing ${fullResults.length} items from ${
              typeof this.settings.source.getAllFull === 'string'
                ? this.settings.source.getAllFull
                : this.settings.source.getAllFull.url
            }...`
          );

          for (const data of fullResults) {
            const sourceUri = this.settings.source.getOneFull && this.settings.source.getOneFull(data);
            const destUri = await this.actions.importOne({ sourceUri, data }, { parentCtx: ctx });
            if (destUri) this.imported[sourceUri] = destUri;
          }
        } else {
          throw new Error(
            `Error fetching the endpoint ${
              typeof this.settings.source.getAllFull === 'string'
                ? this.settings.source.getAllFull
                : this.settings.source.getAllFull.url
            }...`
          );
        }
      } else {
        throw new Error('You must define the setting source.getAllCompact or source.getAllFull');
      }

      this.logger.info(`Import finished !`);
    },
    synchronize() {
      if (this.createJob) {
        this.createJob(this.name, 'synchronize', {});
      } else {
        // If QueueMixin is not available, call method with fake job object
        return this.processSynchronize({
          data: {},
          progress: number => this.logger.info(`Progress: ${number}%`),
          log: message => this.logger.info(message)
        });
      }
    },
    async importOne(ctx) {
      let { sourceUri, destUri, data } = ctx.params;

      if (!data) {
        data = await this.getOne(sourceUri);

        if (!data) {
          this.logger.warn(`Invalid ${sourceUri}...`);
          return false; // False = delete resource if it exists
        }
      }

      const resource = await this.transform(data);

      // If resource is false, it means it is not published
      if (!resource) {
        this.logger.info(`Skipping ${sourceUri} (not published)...`);
        return false; // False = delete resource if it exists
      }
      if (destUri) {
        const oldData = await ctx.call('ldp.resource.get', {
          resourceUri: destUri,
          webId: 'system'
        });

        const oldUpdatedDate = oldData['dc:modified'];
        const newUpdatedDate = this.getField('updated', data);

        if (!oldUpdatedDate || !newUpdatedDate || new Date(newUpdatedDate) > new Date(oldUpdatedDate)) {
          this.logger.info(`Reimporting ${sourceUri}...`);

          const oldDataToKeep =
            this.settings.dest.predicatesToKeep.length > 0
              ? Object.fromEntries(
                  Object.entries(oldData).filter(([key]) => this.settings.dest.predicatesToKeep.includes(key))
                )
              : {};

          try {
            await ctx.call('ldp.resource.put', {
              resource: {
                '@id': destUri,
                ...resource,
                ...oldDataToKeep,
                'dc:source': sourceUri,
                'dc:created': resource['dc:created'] || this.getField('created', data),
                'dc:modified': resource['dc:modified'] || this.getField('updated', data),
                'dc:creator': resource['dc:creator'] || this.settings.dest.actorUri
              },
              webId: 'system'
            });
          } catch (e) {
            this.logger.warn(`Unable to update ${destUri} (Error message: ${e.message})`);
            return false;
          }
        } else {
          this.logger.info(`Skipping ${sourceUri} (not changed)...`);
          return true; // True = skipping
        }
      } else {
        this.logger.info(`Importing ${sourceUri}...`);

        if (!this.settings.dest.containerUri) {
          throw new Error(`Cannot import as dest.containerUri setting is not defined`);
        }

        try {
          destUri = await ctx.call('ldp.container.post', {
            containerUri:
              typeof this.settings.dest.containerUri === 'string'
                ? this.settings.dest.containerUri
                : this.settings.dest.containerUri(resource),
            slug: this.getField('slug', data),
            resource: {
              ...resource,
              'dc:source': sourceUri,
              'dc:created': resource['dc:created'] || this.getField('created', data),
              'dc:modified': resource['dc:modified'] || this.getField('updated', data),
              'dc:creator': resource['dc:creator'] || this.settings.dest.actorUri
            },
            webId: 'system'
          });
        } catch (e) {
          this.logger.warn(`Unable to import ${sourceUri} (Error message: ${e.message})`);
          return false;
        }

        this.logger.info(`Done! Resource URL: ${destUri}`);
      }

      return destUri;
    },
    async deleteImported(ctx) {
      for (const resourceUri of Object.values(this.imported)) {
        this.logger.info(`Deleting ${resourceUri}...`);

        // TODO also delete blank nodes attached to the resources
        await ctx.call('ldp.resource.delete', {
          resourceUri,
          webId: 'system'
        });
      }

      this.imported = {};
    },
    async list(ctx) {
      return await this.list(ctx.params.url || this.settings.source.getAllFull);
    },
    async getOne(ctx) {
      return await this.getOne(this.settings.source.getOneFull(ctx.params.data));
    },
    getImported() {
      return this.imported;
    }
  },
  methods: {
    async prepare() {
      // Things to do before processing data
    },
    async transform(data) {
      return data;
    },
    async list(url) {
      return await this.fetch(url);
    },
    async getOne(url) {
      return await this.fetch(url);
    },
    async fetch(param) {
      if (typeof param === 'object') {
        const { url, ...fetchOptions } = param;
        const headers = {
          ...this.settings.source.headers,
          ...this.settings.source.fetchOptions.headers,
          ...fetchOptions.headers
        };
        const response = await fetch(url, { ...this.settings.source.fetchOptions, ...fetchOptions, headers });
        if (response.ok) {
          return await response.json();
        }
        return false;
      } else if (param.startsWith('http')) {
        // Parameter is an URL
        const headers = { ...this.settings.source.headers, ...this.settings.source.fetchOptions.headers };
        const response = await fetch(param, { ...this.settings.source.fetchOptions, headers });
        if (response.ok) {
          return await response.json();
        }
        return false;
      } else if (await isDir(param)) {
        // Parameter is a directory
        const filenames = await fsPromises.readdir(param);
        let files = [];
        for (const filename of filenames) {
          try {
            let content = await fsPromises.readFile(`${param}/${filename}`, { encoding: 'utf-8' });
            // Parse file if it is JSON
            try {
              content = JSON.parse(content);
            } catch (e) {
              // Ignore, we will provide the raw content
            }
            files.push(content);
          } catch (e) {
            this.logger.warn(`Could not read file ${param}/${filename}`);
          }
        }
        return files;
      } else {
        // Parameter is a file
        try {
          const file = await fsPromises.readFile(param);
          return JSON.parse(file.toString());
        } catch (e) {
          this.logger.warn(`Could not read file ${param}`);
          return false;
        }
      }
    },
    async postActivity(type, resourceUri) {
      if (this.settings.activitypub.actorUri && this.settings.activitypub.activities.includes(type)) {
        const outbox = await this.broker.call('activitypub.actor.getCollectionUri', {
          actorUri: this.settings.activitypub.actorUri,
          predicate: 'outbox'
        });
        const followers = await this.broker.call('activitypub.actor.getCollectionUri', {
          actorUri: this.settings.activitypub.actorUri,
          predicate: 'followers'
        });

        await this.broker.call(
          'activitypub.outbox.post',
          {
            collectionUri: outbox,
            type,
            object: resourceUri,
            to: [followers, PUBLIC_URI]
          },
          { meta: { webId: this.settings.dest.actorUri } }
        );
      }
    },
    getField(fieldKey, data) {
      const fieldMapping = this.settings.source.fieldsMapping[fieldKey];
      if (fieldMapping) {
        return typeof fieldMapping === 'function' ? fieldMapping.bind(this)(data) : data[fieldMapping];
      }
    },
    async processSynchronize(job) {
      let fromDate;
      let toDate;

      await this.prepare();

      if (this.settings.cronJob.time) {
        const interval = cronParser.parseExpression(this.settings.cronJob.time, {
          currentDate: new Date((job.opts && job.opts.timestamp) || undefined),
          tz: this.settings.cronJob.timeZone
        });
        toDate = new Date(interval.next().toISOString());
        fromDate = new Date(interval.prev().toISOString());
      } else {
        toDate = new Date();
        fromDate = new Date(Date.now() - 86400 * 1000);
      }

      job.log(`Looking for updates from ${fromDate.toString()} to ${toDate.toString()}`);

      const deletedUris = {};
      const createdUris = {};
      const updatedUris = {};
      let newSourceUris = [];
      let mappedFullResults = {};

      const results = await this.list(this.settings.source.getAllCompact || this.settings.source.getAllFull);

      if (!results) {
        job.moveToFailed(`Unable to fetch ${this.settings.source.getAllCompact || this.settings.source.getAllFull}`);
        return;
      }

      job.progress(5);

      const oldSourceUris = Object.keys(this.imported);

      if (this.settings.source.getAllCompact) {
        newSourceUris = results.map(data => this.settings.source.getOneFull(data));
      } else {
        // If we have no compact results, put the data in an object so that we can easily use it with importOne
        mappedFullResults = Object.fromEntries(results.map(data => [this.settings.source.getOneFull(data), data]));
        newSourceUris = Object.keys(mappedFullResults);
      }

      job.progress(10);

      /// ////////////////////////////////////////
      // DELETED RESOURCES
      /// ////////////////////////////////////////

      const urisToDelete = oldSourceUris.filter(uri => !newSourceUris.includes(uri));
      for (const sourceUri of urisToDelete) {
        this.logger.info(`Resource ${sourceUri} does not exist anymore, deleting it...`);

        await this.broker.call('ldp.resource.delete', {
          resourceUri: this.imported[sourceUri],
          webId: 'system'
        });

        await this.postActivity(ACTIVITY_TYPES.DELETE, this.imported[sourceUri]);

        deletedUris[sourceUri] = this.imported[sourceUri];

        // Remove resource from local cache
        delete this.imported[sourceUri];
      }

      job.progress(40);

      /// ////////////////////////////////////////
      // CREATED RESOURCES
      /// ////////////////////////////////////////

      const urisToCreate = newSourceUris.filter(uri => !oldSourceUris.includes(uri));
      for (const sourceUri of urisToCreate) {
        this.logger.info(`Resource ${sourceUri} did not exist, importing it...`);

        const destUri = await this.actions.importOne({ sourceUri, data: mappedFullResults[sourceUri] });

        if (destUri) {
          await this.postActivity(ACTIVITY_TYPES.CREATE, destUri);

          createdUris[sourceUri] = destUri;

          // Add resource to local cache
          this.imported[sourceUri] = destUri;
        }
      }

      job.progress(70);

      /// ////////////////////////////////////////
      // UPDATED RESOURCES
      /// ////////////////////////////////////////

      const urisToUpdate = results
        .filter(data => {
          // If an updated field is available in compact results, filter out items outside of the time frame
          const updated = this.getField('updated', data);
          return updated ? fromDate < new Date(updated) && new Date(updated) > toDate : true;
        })
        .map(data => this.settings.source.getOneFull(data))
        .filter(uri => !urisToCreate.includes(uri));

      for (const sourceUri of urisToUpdate) {
        const result = await this.actions.importOne({
          sourceUri,
          destUri: this.imported[sourceUri],
          data: mappedFullResults[sourceUri]
        });

        if (result === false) {
          await this.broker.call('ldp.resource.delete', {
            resourceUri: this.imported[sourceUri],
            webId: 'system'
          });

          await this.postActivity(ACTIVITY_TYPES.DELETE, this.imported[sourceUri]);

          deletedUris[sourceUri] = this.imported[sourceUri];

          // Remove resource from local cache
          delete this.imported[sourceUri];
        } else if (result === true) {
          // Resource has not changed, ignore...
        } else {
          await this.postActivity(ACTIVITY_TYPES.UPDATE, this.imported[sourceUri]);

          updatedUris[sourceUri] = this.imported[sourceUri];
        }
      }

      job.progress(100);

      return {
        deletedUris,
        createdUris,
        updatedUris
      };
    }
  }
};
