const DbService = require('moleculer-db');
const { Expo } = require('expo-server-sdk');
const { TripleStoreAdapter } = require('@semapps/triplestore');

const ExpoPushNotificationService = {
  name: 'expo-push.notification',
  mixins: [DbService],
  adapter: new TripleStoreAdapter({ type: 'PushNotification', dataset: 'settings' }),
  settings: {
    idField: '@id'
  },
  started() {
    this.expo = new Expo();

    // Check receipts every 5 minutes
    setInterval(this.actions.checkReceipts, 5 * 60 * 1000);
  },
  actions: {
    async send(ctx) {
      await this.actions.queue(ctx.params, { parentCtx: ctx });

      this.actions.processQueue({}, { parentCtx: ctx });
    },
    async queue(ctx) {
      const { to, message, data } = ctx.params;

      const devices = await ctx.call('push.device.findUsersDevices', {
        users: Array.isArray(to) ? to : [to]
      });

      for (const device of devices) {
        await this.actions.create(
          {
            deviceId: device.id,
            addedAt: new Date().toISOString(),
            status: 'queued',
            message: JSON.stringify({
              to: device.pushToken,
              body: message,
              data
            })
          },
          { parentCtx: ctx }
        );
      }
    },
    async processQueue(ctx) {
      const notifications = await this.findByStatus('queued', ctx);

      for (const notification of notifications) {
        const message = JSON.parse(notification['semapps:message']);

        if (!Expo.isExpoPushToken(message.to)) {
          await this.markAsError(notification['@id'], `${message.to} is not a valid Expo push token`, ctx);
        } else {
          const receipt = await this.expo.sendPushNotificationsAsync([message]);

          // NOTE: Not all tickets have IDs; for example, tickets for notifications
          // that could not be enqueued will have error information and no receipt ID.
          if (receipt[0].id) {
            await this.actions.update(
              {
                '@id': notification['@id'],
                status: 'processed',
                receiptId: receipt[0].id
              },
              { parentCtx: ctx }
            );
          } else {
            // NOTE: If a ticket contains an error code in ticket.details.error, you
            // must handle it appropriately. The error codes are listed in the Expo
            // documentation:
            // https://docs.expo.io/versions/latest/guides/push-notifications#response-format
            await this.markAsError(notification['@id'], receipt.details.error, ctx);
          }
        }
      }
    },
    async checkReceipts(ctx) {
      const notifications = await this.findByStatus('processed', ctx);

      if (notifications) {
        const receiptIdChunks = this.expo.chunkPushNotificationReceiptIds(
          notifications.map(notification => notification['semapps:receiptId'])
        );

        // Like sending notifications, there are different strategies you could use
        // to retrieve batches of receipts from the Expo service.
        for (const chunk of receiptIdChunks) {
          try {
            const receipts = await this.expo.getPushNotificationReceiptsAsync(chunk);

            // The receipts specify whether Apple or Google successfully received the
            // notification and information about an error, if one occurred.
            for (const receiptId in receipts) {
              let { status, message, details } = receipts[receiptId];
              const notificationId = notifications.find(notification => notification.receiptId === receiptId)['@id'];

              if (status === 'ok') {
                await this.actions.update(
                  {
                    '@id': notificationId,
                    status: 'checked',
                    receiptStatus: status
                  },
                  { parentCtx: ctx }
                );
              } else if (status === 'error') {
                // Append the error code to the message for easier debug
                if (details && details.error) {
                  // The error codes are listed in the Expo documentation:
                  // https://docs.expo.io/versions/latest/guides/push-notifications/#individual-errors
                  message = `Error code ${details.error}. ${message}`;
                }

                await this.markAsError(notificationId, message, ctx);
              }
            }
          } catch (error) {
            console.error(error);
          }
        }
      }
    }
  },
  methods: {
    async findByStatus(status, ctx) {
      const collection = await this.actions.find(
        {
          query: { status }
        },
        { parentCtx: ctx }
      );
      return collection['ldp:contains'] || [];
    },
    async markAsError(notificationId, message, ctx) {
      const notification = await this.actions.update(
        {
          '@id': notificationId,
          status: 'error',
          errorMessage: message
        },
        { parentCtx: ctx }
      );

      // Also mark device as error
      await ctx.call('push.device.update', {
        '@id': notification.deviceId,
        errorMessage: message
      });
    }
  }
};

module.exports = ExpoPushNotificationService;
