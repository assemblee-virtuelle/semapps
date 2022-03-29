const MailService = require('moleculer-mail');
const cronParser = require('cron-parser');
const DigestSubscriptionService = require("./subscription");

const Service = {
  name: 'digest',
  mixins: [MailService],
  settings: {
    frequencies: {
      // Example for everyday at 5pm:
      // daily: '0 0 17 * * *',
    },
    timeZone: 'Europe/Paris',
    templateFolder: null,
    // See moleculer-mail doc https://github.com/moleculerjs/moleculer-addons/tree/master/packages/moleculer-mail
    from: null,
    transport: null,
    // Data available in all templates
    data: {}
  },
  created() {
    this.broker.createService(DigestSubscriptionService);
  },
  async started() {
    if( !this.createJob ) throw new Error('The QueueMixin of moleculer-bull must be added for the DigestService to work');

    for( const [jobName, cronExp] of Object.entries(this.settings.frequencies) ) {
      // See https://github.com/OptimalBits/bull/blob/master/REFERENCE.md#queueadd
      this.createJob(
        'build',
        jobName,
        {},
        { repeat: { cron: cronExp, tz: this.settings.timeZone } }
      );
    }
  },
  actions: {
    async build(ctx) {
      const { frequency, timestamp } = ctx.params;

      const currentDate = timestamp ? new Date(timestamp) : new Date();

      const interval = cronParser.parseExpression(this.settings.frequencies[frequency], {
        currentDate,
        tz: this.settings.timeZone
      });

      const previousDate = new Date(interval.prev().toISOString());

      const subscriptions = await ctx.call('digest.subscription.find', { query: { frequency } });

      for( let subscription of subscriptions ) {
        const subscriber = await ctx.call('activitypub.actor.get', { actorUri: subscription.webId });
        const newActivities = await ctx.call('activitypub.inbox.getByDates', { collectionUri: subscriber.inbox, fromDate: previousDate, toDate: currentDate });

        if( newActivities.length > 0 ) {
          let notifications = [], notificationsByCategories = {};

          // Map received activities to notifications
          for( let activity of newActivities ) {
            const notification = await ctx.call('activity-mapping.map', { activity, locale: subscription.locale });
            if( notification ) {
              notifications.push(notification);
              if( notification.category ) {
                if( !notificationsByCategories[notification.category] ) notificationsByCategories[notification.category] = { category: notification.category, notifications: [] };
                notificationsByCategories[notification.category].notifications.push(notification);
              }
            }
          }

          // If we have at least one notification, send email
          if(notifications.length > 0) {
            await this.actions.send(
              {
                to: subscription.email,
                template: 'digest',
                locale: subscription.locale,
                data: {
                  notifications,
                  notificationsByCategories,
                  subscriber,
                  subscription
                }
              },
              {
                parentCtx: ctx
              }
            );
          }
        }
      }
    }
  },
  queues: {
    build: [
      {
        name: '*',
        process(job) {
          this.actions.build({ frequency: job.name, timestamp: job.opts.prevMillis });
        }
      }
    ]
  }
};

module.exports = Service;
