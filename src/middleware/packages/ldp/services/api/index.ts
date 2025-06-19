import urlJoin from 'url-join';
import deleteAction from './actions/delete.ts';
import getAction from './actions/get.ts';
import headAction from './actions/head.ts';
import patchAction from './actions/patch.ts';
import postAction from './actions/post.ts';
import putAction from './actions/put.ts';
import getCatchAllRoute from '../../routes/getCatchAllRoute.ts';
import getPodsRoute from '../../routes/getPodsRoute.ts';
import { ServiceSchema, defineAction } from 'moleculer';

const LdpApiSchema = {
  name: 'ldp.api' as const,
  settings: {
    baseUrl: null,
    podProvider: false
  },
  dependencies: ['api'],
  actions: {
    delete: deleteAction,
    get: getAction,
    head: headAction,
    patch: patchAction,
    post: postAction,
    put: putAction
  },
  async started() {
    const { baseUrl, podProvider } = this.settings;
    const { pathname: basePath } = new URL(baseUrl);

    if (podProvider) {
      await this.broker.call('api.addRoute', { route: getPodsRoute(basePath) });
    }

    await this.broker.call('api.addRoute', {
      route: getCatchAllRoute(basePath, podProvider)
    });
  },
  methods: {
    getUriFromSlugParts(slugParts, username) {
      if (this.settings.podProvider && username) {
        if (!slugParts) slugParts = []; // Root container on pods doesn't have a trailing slash
        return urlJoin(this.settings.baseUrl, username, ...slugParts);
      } else {
        if (!slugParts || slugParts.length === 0) slugParts = ['/']; // Root container has a trailing slash
        return urlJoin(this.settings.baseUrl, ...slugParts);
      }
    }
  }
} satisfies ServiceSchema;

export default LdpApiSchema;

declare global {
  export namespace Moleculer {
    export interface AllServices {
      [LdpApiSchema.name]: typeof LdpApiSchema;
    }
  }
}
