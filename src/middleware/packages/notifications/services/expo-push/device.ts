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

        // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
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
          // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
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

          // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
          if (this.settings.newDeviceNotification && this.settings.newDeviceNotification.message) {
            await ctx.call('push.notification.send', {
              to: userUri,
              // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
              ...this.settings.newDeviceNotification
            });
          }
        } else {
          // If there was an error message on the device, clear it
          // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
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

        // @ts-expect-error TS(2488): Type 'never' must have a '[Symbol.iterator]()' met... Remove this comment to see the full error message
        for (const userUri of ctx.params.users) {
          // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
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
