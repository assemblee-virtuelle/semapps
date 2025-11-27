import { ServiceSchema } from 'moleculer';

const ApiService = {
  name: 'activitypub.api' as const,
  actions: {
    inbox: {
      async handler(ctx) {
        let { collectionUri, payload } = ctx.params;

        await ctx.call('activitypub.inbox.post', { collectionUri, ...payload });

        ctx.meta.$statusCode = 202;
      }
    },
    outbox: {
      async handler(ctx) {
        let { collectionUri, payload } = ctx.params;

        const activity: any = await ctx.call('activitypub.outbox.post', { collectionUri, ...payload });

        ctx.meta.$responseHeaders = {
          Location: activity.id || activity['@id'],
          'Content-Length': 0
        };

        // We need to set this also here (in addition to above) or we get a Moleculer warning
        ctx.meta.$location = activity.id || activity['@id'];
        ctx.meta.$statusCode = 201;
      }
    }
  }
} satisfies ServiceSchema;

export default ApiService;

declare global {
  export namespace Moleculer {
    export interface AllServices {
      [ApiService.name]: typeof ApiService;
    }
  }
}
