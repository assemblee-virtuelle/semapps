const { credentialsContext } = require('@semapps/crypto');
const { arrayOf } = require('@semapps/ldp');
const { MIME_TYPES } = require('@semapps/mime-types');
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
  },
  actions: {
    /**
     * Add a new processor to handle activities
     */
    async addProcessor(ctx) {
      const { matcher, actionName, boxTypes, key, capabilityGrantMatchFnGenerator, priority = 10 } = ctx.params;

      this.processors.push({ matcher, actionName, boxTypes, key, priority, capabilityGrantMatchFnGenerator });

      // Sort processors by priority
      this.processors.sort((a, b) => a.priority - b.priority);
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
        { removeOnComplete: { age: 259200 } } // Keep completed jobs for 3 days
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
        { removeOnComplete: { age: 259200 } } // Keep completed jobs for 3 days
      );

      await job.finished();
    },
    getProcessors() {
      return this.processors;
    }
  },
  methods: {
    matchActivity(pattern, activity, fetcher) {
      return matchActivity(pattern, activity, fetcher);
    },
    async fetch(resourceUri, webId, dataset) {
      try {
        // We must not return immediately, or errors will not be caught below
        const resource = await this.broker.call(
          'ldp.resource.get',
          {
            resourceUri,
            accept: MIME_TYPES.JSON,
            webId
          },
          { meta: { dataset } }
        );
        return resource;
      } catch (e) {
        this.logger.warn(
          `Could not fetch ${resourceUri} with webId ${webId} and dataset ${dataset}. Error: ${e.message}`
        );
        return false;
      }
    },
    /** Verify that capability is signed, proof purpose is correct, and capability holder is the actor. */
    async verifyCapabilityIntegrity(activity) {
      const retActivity = activity;

      // Dereference capability, if necessary.
      if (typeof retActivity.capability === 'string') {
        retActivity.capability = await this.broker.call('crypto.vc.holder.presentation-container.get', {
          resourceUri: retActivity.capability
        });
      }

      // Check that holder is the invoker/actor.
      if (activity.capability.holder !== activity.actor) {
        throw new Error("The activity's actor must be the holder of the capability presentation.", {
          cause: { activity }
        });
      }

      if (arrayOf(activity.capability.verifiableCredential).length === 0) {
        throw new Error('Capability has no verifiable credentials');
      }

      // Verify cryptographic and capability-related properties.
      const { verified, error } = await this.broker.call('crypto.vc.verifier.verifyCapabilityPresentation', {
        verifiablePresentation: retActivity.capability
      });

      if (!verified) {
        throw new Error(`Capability presentation of activity ${retActivity.id} is not valid: ${error}`);
      }

      return retActivity;
    },
    /** Verify that activity grants match activity. */
    async verifyCapabilityGrants(activity, recipient, fetcher) {
      const dereferencedActivity = activity;

      const verifiableCredentials = arrayOf(dereferencedActivity.capability.verifiableCredential);

      // Check that issuer is the recipient.
      if (verifiableCredentials[0].issuer !== recipient) {
        return {
          match: false,
          dereferencedActivity,
          error: new Error('The issuer of the capability must be the recipient of the capability-based activity.', {
            cause: { activity, recipient }
          })
        };
      }

      // Verify that each VC capability in the chain has an ActivityGrant that matches the activity's pattern.
      for (const vc of verifiableCredentials) {
        // At least one grant has to match in this VC
        const activityGrantsInVc = arrayOf(vc.credentialSubject).flatMap(subject =>
          arrayOf(subject['apods:hasActivityGrant'])
        );

        let grantMatchedInVc = false;
        for (const grant of activityGrantsInVc) {
          // Frame grant to get same shape as activity.
          const compactedGrant = await this.compactActivityGrant(grant);

          // Check that all properties of the grant are present in activity.
          const matchResult = await matchActivity(compactedGrant, dereferencedActivity, fetcher);
          if (matchResult.match) {
            grantMatchedInVc = true;
            break;
          }
        }
        // At least one grant must have matched.
        if (!grantMatchedInVc)
          return {
            match: false,
            dereferencedActivity,
            error: new Error(
              'Capability does not authorize this activity to be performed. Some VC ActivityGrant did not match activity',
              { cause: activityGrantsInVc }
            )
          };
      }

      // All grants matched.

      return { match: true, dereferencedActivity };
    },
    async compactActivityGrant(activityGrant) {
      const compactedGrant = await this.broker.call('jsonld.parser.compact', {
        input: {
          '@context': credentialsContext,
          ...activityGrant
        },
        context: await this.broker.call('jsonld.context.get')
      });
      delete compactedGrant['@context'];

      return compactedGrant;
    },
    async runInboxProcessor({ processor, recipientUri, dataset, fetcher, activity }) {
      let match = false;
      let dereferencedActivity = activity;

      // 1. Run matcher.
      // Even if there is no match, we keep the dereferenced activity in memory so that we don't need to dereference it again
      ({ match, dereferencedActivity } = await this.matchActivity(
        processor.matcher,
        dereferencedActivity,
        // TODO: Check if this might be a SECURITY issue because properties
        // are kept dereferenced for actors that might not have rights to do that.
        fetcher
      ));
      if (!match) return { match: false, dereferencedActivity };

      if (dereferencedActivity.capability && processor.capabilityGrantMatchFnGenerator) {
        // 2.1 Verify that activity grants match activity pattern.
        // TODO: It might be nice to run this only once (after everything is dereferenced).
        // This would require the whole matching to be processed before any handler is called.
        ({ match, dereferencedActivity } = await this.verifyCapabilityGrants(activity, recipientUri, fetcher));
        if (!match) return { match: false, dereferencedActivity };

        // 2.2 Verify that ActivityGrant matches processor requirements.
        // The capabilityGrantMatchFnGenerator creates a matcher function which needs to match
        // at least one ActivityGrant per VC in the chain.
        const matchGrantFn = await processor.capabilityGrantMatchFnGenerator({
          activity: dereferencedActivity,
          recipientUri
        });

        // 2.2.1
        // For each VC in chain...
        let matchedAllVcs = true;
        for (const vc of arrayOf(dereferencedActivity.capability?.verifiableCredential)) {
          // ...one ActivityGrant has to match.

          const grantsOfVc = arrayOf(vc.credentialSubject).flatMap(subject =>
            arrayOf(subject['apods:hasActivityGrant'])
          );

          let matchedVc = false;
          for (const grant of grantsOfVc) {
            const compactedGrant = await this.compactActivityGrant(grant);
            if (await matchGrantFn(compactedGrant)) {
              matchedVc = true;
              break;
            }
          }
          if (!matchedVc) {
            matchedAllVcs = false;
            break;
          }
        }
        match = matchedAllVcs;
      } else if (processor.capabilityGrantMatchFnGenerator && !dereferencedActivity.capability) {
        // Handler requires capability but none is given.
        return { match: false, dereferencedActivity };
      }

      // 3, Run handler on match.
      if (match) {
        try {
          const result = await this.broker.call(
            processor.actionName,
            {
              key: processor.key,
              boxType: 'inbox',
              dereferencedActivity,
              actorUri: recipientUri
            },
            {
              meta: { webId: recipientUri, dataset }
            }
          );
          return { match, result, dereferencedActivity };
        } catch (error) {
          // Show error because the QueueService transforms it in something that makes it lose the stacktrace
          console.error(error);
          return { match, error, dereferencedActivity };
        }
      }
      return { match: false, dereferencedActivity };
    }
  },
  queues: {
    processInbox: {
      name: '*',
      // We must allow multiple jobs to be run at the same time, otherwise if
      // the activitypub.outbox.post action is called by a processor, the jobs queue will halt
      // (the first job will stay in active state, the other one in pending state)
      concurrency: 5,
      async process(job) {
        const { activity, recipients } = job.data;
        const startTime = performance.now();
        let errors = [];
        let dereferencedActivity = activity;

        // If capability present, verify it.
        if (activity.capability) {
          // Will throw, if invalid
          dereferencedActivity = await this.verifyCapabilityIntegrity(dereferencedActivity, recipients);
        }

        try {
          // Process activity for each recipient and activity handler.
          for (const recipientUri of recipients) {
            this.logger.info(`Processing activity ${activity.id} received in the inbox of ${recipientUri}...`);
            job.log(`Processing activity for recipient ${recipientUri}...`);

            const dataset = this.settings.podProvider
              ? await this.broker.call('auth.account.findDatasetByWebId', { webId: recipientUri })
              : undefined;
            const fetcher = resourceUri => this.fetch(resourceUri, recipientUri, dataset);

            for (const processor of this.processors) {
              if (processor.boxTypes.includes('inbox')) {
                let error;
                let match;
                let result;
                ({ error, match, result, dereferencedActivity } = await this.runInboxProcessor({
                  processor,
                  recipientUri,
                  dataset,
                  fetcher,
                  activity
                }));

                if (match && error) {
                  job.log(`ERROR ${processor.key} (${processor.actionName}): ${error.message}`);
                  errors.push(processor.key);
                } else if (match && result) {
                  job.log(
                    `SUCCESS ${processor.key} (${processor.actionName}): ${
                      typeof result === 'object' ? JSON.stringify(result) : result
                    }`
                  );
                } else {
                  job.log(`SKIP ${processor.key} (${processor.actionName})`);
                }
              }
            }
          }
        } catch (error) {
          // Log error and throw again.
          console.error(error);
          throw error;
        }

        if (errors.length > 0) {
          throw new Error(
            `Could not fully process activity ${activity.id}. Error with the processor(s) ${errors.join(', ')}`
          );
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
      // We must allow multiple jobs to be run at the same time, otherwise if
      // the activitypub.outbox.post action is called by a processor, the jobs queue will halt
      // (the first job will stay in active state, the other one in pending state)
      concurrency: 5,
      async process(job) {
        const { activity } = job.data;
        const emitterUri = activity.actor;
        const startTime = performance.now();
        let match;
        let dereferencedActivity = activity;

        const dataset = this.settings.podProvider
          ? await this.broker.call('auth.account.findDatasetByWebId', { webId: emitterUri })
          : undefined;
        const fetcher = resourceUri => this.fetch(resourceUri, emitterUri, dataset);

        for (const processor of this.processors) {
          if (processor.boxTypes.includes('outbox')) {
            // If the processor has a capabilityGrantMatchFnGenerator, the activity must have a capability.
            if (processor.capabilityGrantMatchFnGenerator && !activity.capability) {
              // Capability present but no matcher or vice versa.
              match = false;
            } else {
              // Even if there is no match, we keep in memory the dereferenced activity so that we don't need to dereference it again
              ({ match, dereferencedActivity } = await this.matchActivity(
                processor.matcher,
                dereferencedActivity,
                fetcher
              ));
            }

            if (match) {
              try {
                const result = await this.broker.call(
                  processor.actionName,
                  {
                    key: processor.key,
                    boxType: 'outbox',
                    dereferencedActivity,
                    actorUri: emitterUri
                  },
                  {
                    meta: { webId: emitterUri, dataset }
                  }
                );
                job.log(
                  `SUCCESS ${processor.key} (${processor.actionName}): ${
                    typeof result === 'object' ? JSON.stringify(result) : result
                  }`
                );
              } catch (e) {
                job.log(`ERROR ${processor.key} (${processor.actionName}): ${e.message}`);
                // When sending through the outbox, we want to return immediately the error
                // TODO Call a new "revert" method for every side-effect processor ?
                // Show error because the QueueService transforms it in something that makes it lose the stacktrace
                console.error(e);
                throw e;
              }
            } else {
              job.log(`SKIP ${processor.key} (${processor.actionName})`);
            }
          }
        }

        return {
          dereferencedActivity,
          executionTime: `${Math.ceil(performance.now() - startTime) / 1000}s`
        };
      }
    }
  }
};
