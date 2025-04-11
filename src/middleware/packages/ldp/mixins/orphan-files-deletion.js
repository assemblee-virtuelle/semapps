const { CronJob } = require('cron');
const urlJoin = require('url-join');

module.exports = {
  settings: {
    orphanFilesDeletion: {
      baseUrl: undefined,
      cronJob: {
        time: '0 0 4 * * *', // Every night at 4am
        timeZone: 'Europe/Paris'
      }
    }
  },
  dependencies: ['triplestore', 'ldp.resource'],
  actions: {
    async checkOrphanFiles(ctx) {
      try {
        this.logger.info('OrphanFilesDeletion - Check...');

        const containerUri = urlJoin(this.settings.orphanFilesDeletion.baseUrl, this.settings.path);
        const orphanFiles = await ctx.call('triplestore.query', {
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

        this.logger.info(`OrphanFilesDeletion - Found ${orphanFiles.length} orphan files`);

        for (let orphanFile of orphanFiles) {
          await ctx.call('ldp.resource.delete', {
            resourceUri: orphanFile.file.value,
            webId: 'system'
          });

          this.logger.info(`OrphanFilesDeletion - ${orphanFile.file.value} deleted`);
        }
      } catch (error) {
        this.logger.error(`OrphanFilesDeletion - Error: ${error.message}`);
      }
    }
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
};
