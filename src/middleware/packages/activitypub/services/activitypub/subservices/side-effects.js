const { isObject } = require('@semapps/ldp');
const { MIME_TYPES } = require('@semapps/mime-types');
const { objectDepth } = require('../../../utils');
const matchActivity = require('../../../utils/matchActivity');

/**
 * Allow any service to process activities just after they are posted to the inbox or outbox.
 * It uses a jobs queue so that it is easy to watch and debug results
 * We recommend to use the ActivitiesHandlerMixin to make it easier to use this service.
 */
module.exports = {
  name: 'activitypub.side-effects',
  settings: {
    podProvider: false
  },
  async started() {
    this.processors = [];
    if (!this.createJob) throw new Error(`The ActivityProcessorService must be configured with the QueueMixin`);
  },
  actions: {
    /**
     * Add a new processor to handle activities
     */
    async addProcessor(ctx) {
      const { matcher, actionName, boxTypes, key, priority = 10 } = ctx.params;

      this.processors.push({ matcher, actionName, boxTypes, key, priority });

      this.sortProcessors();
    },
    /**
     * Called by activitypub.outbox.post when an activity is posted
     */
    async processOutbox(ctx) {
      const { activity } = ctx.params;

      const job = await this.createJob(
        'processOutbox',
        activity.id,
        { activity },
        { removeOnComplete: { age: 2629800 } } // Keep completed jobs during one month
      );

      await job.finished();
    },
    /**
     * Called by activitypub.inbox.post when an activity is received
     * and by activitypub.outbox.post when an activity is sent to a local actor
     */
    async processInbox(ctx) {
      const { activity, recipients } = ctx.params;

      const job = await this.createJob(
        'processInbox',
        activity.id,
        { activity, recipients },
        { removeOnComplete: { age: 2629800 } } // Keep completed jobs during one month
      );

      await job.finished();
    },
    getProcessors() {
      return this.processors;
    }
  },
  methods: {
    sortProcessors() {
      // Sort processors by priority, then depth of matchers (if matcher is a function, it is put at the end)
      this.processors.sort((a, b) => {
        if (a.priority !== b.priority) {
          return a.priority - b.priority;
        } else if (isObject(a.matcher)) {
          if (isObject(b.matcher)) {
            return objectDepth(a.matcher) - objectDepth(b.matcher);
          } else {
            return 1;
          }
        } else {
          if (isObject(b)) {
            return -1;
          } else {
            return 0;
          }
        }
      });
    },
    matchActivity(pattern, activity, fetcher) {
      return matchActivity(pattern, activity, fetcher);
    },
    // async createJob(queueName, jobName, data, opts) {
    //   this.logger.warn(`QueueMixin not configured, calling job directly`);
    //   try {
    //     await this.schema.queues[queueName].process({ data, log: () => {} });
    //   } catch (e) {
    //     this.logger.error(e.message);
    //   }
    //   return { id: 0 };
    // },
    async waitForJob(queueName, jobId) {
      if (this.getQueue) {
        const queue = this.getQueue(queueName);
        return new Promise((resolve, reject) => {
          queue.on('completed', (job, result) => {
            if (job.id === jobId) resolve(result);
          });
          queue.on('failed', (job, err) => {
            if (job.id === jobId) reject(err);
          });
        });
      }
    },
    async fetch(resourceUri, webId, dataset) {
      try {
        return await this.broker.call(
          'ldp.resource.get',
          {
            resourceUri,
            accept: MIME_TYPES.JSON,
            webId
          },
          { meta: { dataset } }
        );
      } catch (e) {
        this.logger.warn(
          `Could not fetch ${resourceUri} with webId ${webId} and dataset ${dataset}. Error: ${e.message}`
        );
        return false;
      }
    }
  },
  queues: {
    processInbox: {
      name: '*',
      async process(job) {
        const { activity, recipients } = job.data;
        const startTime = performance.now();
        let numErrors = 0,
          match,
          dereferencedActivity = activity;

        for (const recipientUri of recipients) {
          job.log(`Processing activity ${activity.id} received in the inbox of ${recipientUri}...`);

          const dataset = this.settings.podProvider
            ? await this.broker.call('auth.account.findDatasetByWebId', { webId: recipientUri })
            : undefined;
          const fetcher = resourceUri => this.fetch(resourceUri, recipientUri, dataset);

          for (const processor of this.processors) {
            if (processor.boxTypes.includes('inbox')) {
              // Even if there is no match, we keep in memory the dereferenced activity so that we don't need to dereference it again
              ({ match, dereferencedActivity } = await this.matchActivity(
                processor.matcher,
                dereferencedActivity,
                fetcher
              ));

              if (match) {
                try {
                  const result = await this.broker.call(processor.actionName, {
                    key: processor.key,
                    boxType: 'inbox',
                    dereferencedActivity,
                    actorUri: recipientUri
                  });
                  job.log(
                    `SUCCESS ${processor.key} (${processor.actionName}): ${
                      typeof result === 'object' ? JSON.stringify(result) : result
                    }`
                  );
                } catch (e) {
                  job.log(`ERROR ${processor.key} (${processor.actionName}): ${e.message}`);
                  numErrors++;
                }
              } else {
                job.log(`SKIP ${processor.key} (${processor.actionName})`);
              }
            }
          }
        }

        if (numErrors > 0) {
          await job.discard();
          throw new Error(`Could not fully process activity ${activity.id}. ${numErrors} errors detected`);
        } else {
          return {
            dereferencedActivity,
            executionTime: `${Math.ceil(performance.now() - startTime) / 1000}s`
          };
        }
      }
    },
    processOutbox: {
      name: '*',
      async process(job) {
        const { activity } = job.data;
        const emitterUri = activity.actor;
        const startTime = performance.now();
        let numErrors = 0,
          match,
          dereferencedActivity = activity;

        job.log(`Processing activity ${activity.id} emitted to the outbox of ${emitterUri}...`);

        const dataset = this.settings.podProvider
          ? await this.broker.call('auth.account.findDatasetByWebId', { webId: emitterUri })
          : undefined;
        const fetcher = resourceUri => this.fetch(resourceUri, emitterUri, dataset);

        for (const processor of this.processors) {
          if (processor.boxTypes.includes('inbox')) {
            // Even if there is no match, we keep in memory the dereferenced activity so that we don't need to dereference it again
            ({ match, dereferencedActivity } = await this.matchActivity(
              processor.matcher,
              dereferencedActivity,
              fetcher
            ));

            if (match) {
              try {
                const result = await this.broker.call(processor.actionName, {
                  key: processor.key,
                  boxType: 'inbox',
                  dereferencedActivity,
                  actorUri: emitterUri
                });
                job.log(
                  `SUCCESS ${processor.key} (${processor.actionName}): ${
                    typeof result === 'object' ? JSON.stringify(result) : result
                  }`
                );
              } catch (e) {
                job.log(`ERROR ${processor.key} (${processor.actionName}): ${e.message}`);
                numErrors++;
              }
            } else {
              job.log(`SKIP ${processor.key} (${processor.actionName})`);
            }
          }
        }

        if (numErrors > 0) {
          throw new Error(`Could not fully process activity ${activity.id}. ${numErrors} errors detected`);
        } else {
          return {
            dereferencedActivity,
            executionTime: `${Math.ceil(performance.now() - startTime) / 1000}s`
          };
        }
      }
    }
  }
};
