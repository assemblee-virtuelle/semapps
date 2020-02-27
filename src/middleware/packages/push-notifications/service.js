const DeviceService = require('./services/device');
const { Expo } = require('expo-server-sdk');

const PushNotificationsService = {
  name: 'push-notifications',
  settings: {
    baseUri: null,
    storage: {
      devices: null
    },
    welcomeNotification: {
      message: null,
      data: {}
    }
  },
  created() {
    this.broker.createService(DeviceService, {
      adapter: this.schema.storage.devices,
      settings: {
        containerUri: this.schema.baseUri + 'objects/',
        context: {
          '@vocab': this.schema.baseUri + 'ontology/semapps#'
        }
      }
    });
  },
  started() {
    this.expo = new Expo();
    this.tickets = [];

    setInterval(this.checkReceipts, 5 * 60 * 1000);
  },
  actions: {
    async subscribe(ctx) {
      const { userUri, pushToken } = ctx.params;

      let device = await ctx.call('push-notifications.device.find', {
        'ownedBy': userUri,
      });

      if( !device ) {
        device = await ctx.call('push-notifications.device.create', {
          '@type': 'Device',
          ownedBy: userUri,
          pushToken
        });

        if( this.settings.welcomeNotification && this.settings.welcomeNotification.message ) {
          await this.actions.notifyUser({ userUri, ...this.settings.welcomeNotification });
        }
      } else if ( device.errorMessage ) {
        // If there was an error message on the device, clear it
        device = await ctx.call('push-notifications.device.update', {
          '@id': device['@id'],
          errorMessage: null
        });
      }

      return device;
    },
    async notifyUser(ctx) {
      const { userUri, message, data } = ctx.params;

      const device = await ctx.call('push-notifications.device.find', {
        'ownedBy': userUri,
      });

      if( device && !device.errorMessage ) {
        if (!Expo.isExpoPushToken(ctx.params.pushToken)) {
          console.error(`Push token ${ctx.params.pushToken} is not a valid Expo push token`);
          return;
        }

        const ticket = await this.expo.push({
          to: device.pushToken,
          body: message,
          data: data
        });

        this.addTicketToCheck(ticket);
      }
    }
  },
  methods: {
    addTicketToCheck(ticket) {
      // NOTE: Not all tickets have IDs; for example, tickets for notifications
      // that could not be enqueued will have error information and no receipt ID.
      if (ticket.id) {
        this.tickets.push(ticket);
      }
    },
    async checkReceipts() {
      if( this.tickets.length > 0 ) {
        let receiptIdChunks = this.expo.chunkPushNotificationReceiptIds(this.tickets.map(ticket => ticket.id));

        // Like sending notifications, there are different strategies you could use
        // to retrieve batches of receipts from the Expo service.
        for (let chunk of receiptIdChunks) {
          try {
            let receipts = await this.expo.getPushNotificationReceiptsAsync(chunk);

            // The receipts specify whether Apple or Google successfully received the
            // notification and information about an error, if one occurred.
            for (const receiptId in receipts) {
              let { status, message, details } = receipts[receiptId];
              if (status === "ok") {
                continue;
              } else if (status === "error") {

                if (details && details.error) {
                  // The error codes are listed in the Expo documentation:
                  // https://docs.expo.io/versions/latest/guides/push-notifications/#individual-errors
                  message = `Error code ${details.error}. ${message}`;
                }

                // TODO get device token from ticket ??
                const pushToken = '...';

                const device = await ctx.call('push-notifications.device.find', {
                  pushToken,
                });

                if( device ) {
                  await ctx.call('push-notifications.device.update', {
                    '@id': device['@id'],
                    pushToken,
                    errorMessage: message
                  })
                }
              }
            }
          } catch (error) {
            console.error(error);
          }
        }
      }
    }
  }
};

module.exports = PushNotificationsService;
