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
          // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
          this.logger.info('OrphanFilesDeletion - Check...');

          // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
          const containerUri = await this.actions.getContainerUri();
          const results = await ctx.call('triplestore.query', {
            query: `
              SELECT ?file
              WHERE {
                <${containerUri}> <http://www.w3.org/ns/ldp#contains> ?file .
                FILTER NOT EXISTS {
                  ?s ?p ?file .
                  FILTER(?s != <${containerUri}>)
                }
              }
            `,
            webId: 'system'
          });

          // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
          this.logger.info(`OrphanFilesDeletion - Found ${results.length} orphan files`);

          for (const { file } of results) {
            await ctx.call('ldp.resource.delete', {
              resourceUri: file.value,
              webId: 'system'
            });

            // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
            this.logger.info(`OrphanFilesDeletion - ${file.value} deleted`);
          }
        } catch (error) {
          // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
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
  // @ts-expect-error TS(1360): Type '{ settings: { orphanFilesDeletion: { cronJob... Remove this comment to see the full error message
} satisfies ServiceSchema;

export default Schema;
