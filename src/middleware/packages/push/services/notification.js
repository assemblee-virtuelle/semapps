const DbService = require('moleculer-db');
const { Expo } = require('expo-server-sdk');
const { TripleStoreAdapter } = require('@semapps/ldp');

const NotificationService = {
  name: 'push.notification',
  mixins: [DbService],
  adapter: new TripleStoreAdapter(),
  settings: {
    containerUri: null,
    context: null
  },
  started() {
    this.expo = new Expo();
    setInterval(this.actions.checkReceipts, 5000 /*5 * 60 * 1000*/);
  },
  actions: {
    async send(ctx) {
      await this.actions.queue(ctx.params);

      this.actions.processQueue();
    },
    async queue(ctx) {
      const { to, message, data } = ctx.params;

      const devices = await ctx.call('push.device.findUsersDevices', {
        users: Array.isArray(to) ? to : [to]
      });

      for (let device of devices) {
        await this.actions.create({
          '@type': 'semapps:PushNotification',
          'semapps:deviceId': device['@id'],
          'semapps:addedAt': new Date().toISOString(),
          'semapps:status': 'queued',
          'semapps:message': JSON.stringify({
            to: device['semapps:pushToken'],
            body: message,
            data
          })
        });
      }
    },
    async processQueue(ctx) {
      const notifications = await this.findByStatus('queued');

      for (let notification of notifications) {
        const message = JSON.parse(notification['semapps:message']);

        if (!Expo.isExpoPushToken(message.to)) {
          await this.markAsError(notification['@id'], `${message.to} is not a valid Expo push token`);
        } else {
          const receipt = await this.expo.sendPushNotificationsAsync([message]);

          // NOTE: Not all tickets have IDs; for example, tickets for notifications
          // that could not be enqueued will have error information and no receipt ID.
          if (receipt[0].id) {
            await this.actions.update({
              '@id': notification['@id'],
              'semapps:status': 'processed',
              'semapps:receiptId': receipt[0].id
            });
          } else {
            // NOTE: If a ticket contains an error code in ticket.details.error, you
            // must handle it appropriately. The error codes are listed in the Expo
            // documentation:
            // https://docs.expo.io/versions/latest/guides/push-notifications#response-format
            await this.markAsError(notification['@id'], receipt.details.error);
          }
        }
      }
    },
    async checkReceipts() {
      const notifications = await this.findByStatus('processed');

      if (notifications) {
        let receiptIdChunks = this.expo.chunkPushNotificationReceiptIds(
          notifications.map(notification => notification['semapps:receiptId'])
        );

        // Like sending notifications, there are different strategies you could use
        // to retrieve batches of receipts from the Expo service.
        for (let chunk of receiptIdChunks) {
          try {
            let receipts = await this.expo.getPushNotificationReceiptsAsync(chunk);

            // The receipts specify whether Apple or Google successfully received the
            // notification and information about an error, if one occurred.
            for (const receiptId in receipts) {
              let { status, message, details } = receipts[receiptId];
              const notificationId = notifications.find(
                notification => notification['semapps:receiptId'] === receiptId
              )['@id'];

              if (status === 'ok') {
                await this.actions.update({
                  '@id': notificationId,
                  'semapps:status': 'checked',
                  'semapps:receiptStatus': status
                });
              } else if (status === 'error') {
                // Append the error code to the message for easier debug
                if (details && details.error) {
                  // The error codes are listed in the Expo documentation:
                  // https://docs.expo.io/versions/latest/guides/push-notifications/#individual-errors
                  message = `Error code ${details.error}. ${message}`;
                }

                await this.markAsError(notificationId, message);
              }

              // TODO invalidate the device if an error is detected
            }
          } catch (error) {
            console.error(error);
          }
        }
      }
    }
  },
  methods: {
    async findByStatus(status) {
      const collection = await this.actions.find({
        query: {
          'semapps:status': status
        }
      });
      return collection['ldp:contains'] || [];
    },
    async markAsError(notificationId, message) {
      const notification = await this.actions.update({
        '@id': notificationId,
        'semapps:status': 'error',
        'semapps:errorMessage': message
      });

      // Also mark device as error
      await this.broker.call('push.device.update', {
        '@id': notification['semapps:deviceId'],
        'semapps:errorMessage': message
      });
    }
  }
};

module.exports = NotificationService;
