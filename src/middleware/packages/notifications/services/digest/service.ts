const MailService = require('moleculer-mail');
const cronParser = require('cron-parser');
const { TripleStoreAdapter } = require('@semapps/triplestore');
const DigestSubscriptionService = require('./subscription');

const DigestNotificationsService = {
  name: 'digest',
  mixins: [MailService],
  settings: {
    frequencies: {
      // Example for everyday at 5pm:
      // daily: '0 0 17 * * *',
    },
    timeZone: 'Europe/Paris',
    subscriptionsDataset: 'settings',
    templateFolder: null,
    // See moleculer-mail doc https://github.com/moleculerjs/moleculer-addons/tree/master/packages/moleculer-mail
    from: null,
    transport: null,
    // Data available in all templates
    data: {}
  },
  dependencies: ['digest.subscription'],
  created() {
    this.broker.createService({
      mixins: [DigestSubscriptionService],
      adapter: new TripleStoreAdapter({ type: 'DigestSubscription', dataset: this.settings.subscriptionsDataset })
    });
  },
  async started() {
    if (!this.createJob)
      throw new Error('The QueueMixin of moleculer-bull must be added for the DigestService to work');

    for (const [jobName, cronExp] of Object.entries(this.settings.frequencies)) {
      // See https://github.com/OptimalBits/bull/blob/master/REFERENCE.md#queueadd
      this.createJob('build', jobName, {}, { repeat: { cron: cronExp, tz: this.settings.timeZone } });
    }
  },
  actions: {
    async build(ctx) {
      const { frequency, timestamp } = ctx.params;
      const success = [];
      const failures = [];

      const currentDate = timestamp ? new Date(timestamp) : new Date();

      const interval = cronParser.parseExpression(this.settings.frequencies[frequency], {
        currentDate,
        tz: this.settings.timeZone
      });

      const previousDate = new Date(interval.prev().toISOString());

      const subscriptions = await ctx.call('digest.subscription.find', { query: { frequency } });

      for (const subscription of subscriptions) {
        try {
          const subscriber = await ctx.call('activitypub.actor.get', { actorUri: subscription.webId });
          const account = await ctx.call('auth.account.findByWebId', { webId: subscription.webId });
          const newActivities = await ctx.call('activitypub.inbox.getByDates', {
            collectionUri: subscriber.inbox,
            fromDate: previousDate,
            toDate: currentDate
          });

          if (newActivities.length > 0) {
            const notifications = [];
            const notificationsByCategories = {};

            // Map received activities to notifications
            for (const activity of newActivities) {
              const notification = await ctx.call('activity-mapping.map', {
                activity,
                locale: subscription.locale || account.locale
              });
              if (notification && (await this.filterNotification(notification, subscription, notifications))) {
                notifications.push(notification);
                if (notification.category) {
                  if (!notificationsByCategories[notification.category])
                    notificationsByCategories[notification.category] = {
                      category: notification.category,
                      notifications: []
                    };
                  notificationsByCategories[notification.category].notifications.push(notification);
                }
              }
            }

            // If we have at least one notification, send email
            if (notifications.length > 0) {
              await this.actions.send(
                {
                  to: subscription.email || account.email,
                  template: 'digest',
                  locale: subscription.locale || account.locale,
                  data: {
                    notifications,
                    notificationsByCategories,
                    subscription,
                    subscriber,
                    account
                  }
                },
                {
                  parentCtx: ctx
                }
              );

              success.push({
                email: subscription.email || account.email,
                locale: subscription.locale || account.locale,
                numNotifications: notifications.length,
                categories: Object.keys(notificationsByCategories),
                notificationsIds: notifications.map(n => n.id),
                subscription
              });
            }
          }
        } catch (e) {
          failures.push({
            error: e.message,
            subscription
          });
        }
      }

      return { failures, success };
    }
  },
  methods: {
    // Optional method called for each notification
    // Return true if you want the notification to be included in the digest
    async filterNotification(notification, subscription) {
      return true;
    }
  },
  queues: {
    build: [
      {
        name: '*',
        process(job) {
          return this.actions.build({ frequency: job.name, timestamp: job.opts.prevMillis });
        }
      }
    ]
  }
};

module.exports = DigestNotificationsService;
