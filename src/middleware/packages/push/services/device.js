const DbService = require('moleculer-db');
const { TripleStoreAdapter } = require('@semapps/ldp');

const DeviceService = {
  name: 'push.device',
  mixins: [DbService],
  adapter: new TripleStoreAdapter(),
  settings: {
    containerUri: null,
    context: null,
    newDeviceNotification: {
      message: null,
      data: {}
    }
  },
  actions: {
    async subscribe(ctx) {
      const { name, yearClass, userUri, pushToken } = ctx.params;

      let device = await this.actions.find({
        query: {
          'semapps:ownedBy': userUri,
          'semapps:pushToken': pushToken
        }
      });

      console.log('device', device);

      if (!device['ldp:contains']) {
        device = await this.actions.create({
          '@type': 'semapps:Device',
          'semapps:name': name,
          'semapps:yearClass': yearClass,
          'semapps:ownedBy': userUri,
          'semapps:pushToken': pushToken,
          'semapps:addedAt': new Date().toISOString()
        });
      } else {
        // If there was an error message on the device, clear it
        device = await this.actions.create({
          '@id': device['ldp:contains'][0]['@id'],
          'semapps:name': name,
          'semapps:yearClass': yearClass,
          'semapps:errorMessage': null
        });
      }

      // TODO remettre plus haut
      if (this.settings.newDeviceNotification && this.settings.newDeviceNotification.message) {
        await ctx.call('push.notification.send', {
          to: userUri,
          ...this.settings.newDeviceNotification
        });
      }

      return device;
    },
    async findUsersDevices(ctx) {
      let devices = [];

      for( let userUri of ctx.params.users ) {
        const container = await this.actions.find({
          query: {
            'semapps:ownedBy': userUri,
            'semapps:errorMessage': null
          }
        });

        if (container['ldp:contains']) {
          devices.push(...container['ldp:contains']);
        }
      }

      return devices;
    }
  }
};

module.exports = DeviceService;
