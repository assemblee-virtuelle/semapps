import { ServiceSchema } from 'moleculer';

const JsonldApiSchema = {
  name: 'jsonld.api' as const,
  settings: {
    localContextPath: null
  },
  dependencies: ['api'],
  async started() {
    await this.broker.call('api.addRoute', {
      route: {
        path: this.settings.localContextPath,
        name: `local-jsonld-context`,
        bodyParsers: {
          json: true
        },
        aliases: {
          'GET /': 'jsonld.api.getContext'
        }
      }
    });
  },
  actions: {
    getContext: {
      async handler(ctx) {
        ctx.meta.$responseType = 'application/ld+json';
        // Set cache to 25s
        if (!ctx.meta.$responseHeaders) ctx.meta.$responseHeaders = {};
        // @ts-expect-error TS(2339): Property '$responseHeaders' does not exist on type '{... Remove this comment to see the full error message
        ctx.meta.$responseHeaders['Cache-Control'] = 'public, max-age=25, s-maxage=10';
        return await ctx.call('jsonld.context.getLocal');
      }
    }
  }
} satisfies ServiceSchema;

export default JsonldApiSchema;

declare global {
  export namespace Moleculer {
    export interface AllServices {
      [JsonldApiSchema.name]: typeof JsonldApiSchema;
    }
  }
}
