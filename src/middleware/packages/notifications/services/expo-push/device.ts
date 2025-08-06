import DbService from 'moleculer-db';
import { TripleStoreAdapter } from '@semapps/triplestore';
import { ServiceSchema, defineAction } from 'moleculer';

const ExpoPushDeviceService = {
  name: 'expo-push.device' as const,
  mixins: [DbService],
  adapter: new TripleStoreAdapter({ type: 'Device', dataset: 'settings' }),
  settings: {
    idField: '@id',
    newDeviceNotification: {
      message: null,
      data: {}
    }
  },
  actions: {
    subscribe: defineAction({
      async handler(ctx) {
        const { name, yearClass, userUri, pushToken } = ctx.params;

        let device = await this.actions.find(
          {
            query: {
              ownedBy: userUri,
              pushToken: pushToken
            }
          },
          { parentCtx: ctx }
        );

        if (!device['ldp:contains']) {
          device = await this.actions.create(
            {
              name: name,
              yearClass: yearClass,
              ownedBy: userUri,
              pushToken: pushToken,
              addedAt: new Date().toISOString()
            },
            { parentCtx: ctx }
          );

          if (this.settings.newDeviceNotification && this.settings.newDeviceNotification.message) {
            await ctx.call('push.notification.send', {
              to: userUri,
              ...this.settings.newDeviceNotification
            });
          }
        } else {
          // If there was an error message on the device, clear it
          device = await this.actions.update(
            {
              '@id': device['ldp:contains'][0]['@id'],
              name: name,
              yearClass: yearClass,
              errorMessage: null
            },
            { parentCtx: ctx }
          );
        }

        return device;
      }
    }),

    findUsersDevices: defineAction({
      async handler(ctx) {
        const devices = [];

        for (const userUri of ctx.params.users) {
          const container = await this.actions.find(
            {
              query: {
                ownedBy: userUri,
                errorMessage: null
              }
            },
            { parentCtx: ctx }
          );

          if (container['ldp:contains']) {
            devices.push(...container['ldp:contains']);
          }
        }

        return devices;
      }
    })
  }
} satisfies ServiceSchema;

export default ExpoPushDeviceService;

declare global {
  export namespace Moleculer {
    export interface AllServices {
      [ExpoPushDeviceService.name]: typeof ExpoPushDeviceService;
    }
  }
}
