import { CronJob } from 'cron';
import { ServiceSchema, defineAction } from 'moleculer';

const Schema = {
  settings: {
    orphanFilesDeletion: {
      cronJob: {
        time: '0 0 4 * * *', // Every night at 4am
        timeZone: 'Europe/Paris'
      }
    }
  },
  dependencies: ['triplestore', 'ldp.resource'],
  actions: {
    checkOrphanFiles: defineAction({
      async handler(ctx) {
        try {
          this.logger.info('OrphanFilesDeletion - Check...');

          const containerUri = await this.actions.getContainerUri();

          // Ignore ACL files
          const results = await ctx.call('triplestore.query', {
            query: `
              SELECT ?file
              WHERE {
                GRAPH <${containerUri}> {
                  <${containerUri}> <http://www.w3.org/ns/ldp#contains> ?file .
                }
                FILTER NOT EXISTS {
                  GRAPH ?g {            
                    ?s ?p ?file .
                    FILTER(?s != <${containerUri}>)
                    FILTER(?p != <http://www.w3.org/ns/auth/acl#accessTo>)
                  }
                }
              }
            `,
            webId: 'system'
          });

          this.logger.info(`OrphanFilesDeletion - Found ${results.length} orphan files`);

          for (const { file } of results) {
            await ctx.call('ldp.resource.delete', {
              resourceUri: file.value,
              webId: 'system'
            });

            this.logger.info(`OrphanFilesDeletion - ${file.value} deleted`);
          }
        } catch (error) {
          this.logger.error(`OrphanFilesDeletion - Error: ${error.message}`);
        }
      }
    })
  },
  created() {
    this.actions.checkOrphanFiles();
    const { cronJob } = this.settings.orphanFilesDeletion || {};
    const { time, timeZone } = cronJob || {};

    if (cronJob) {
      this.cronJob = new CronJob(time, this.actions.checkOrphanFiles, null, true, timeZone);
    }
  },
  stopped() {
    this.cronJob?.stop();
  }
} satisfies ServiceSchema;

export default Schema;
