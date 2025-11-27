import urlJoin from 'url-join';
import { ServiceSchema } from 'moleculer';
import deleteAction from './actions/delete.ts';
import getAction from './actions/get.ts';
import headAction from './actions/head.ts';
import patchAction from './actions/patch.ts';
import postAction from './actions/post.ts';
import putAction from './actions/put.ts';
import getCatchAllRoute from '../../routes/getCatchAllRoute.ts';
import getPodsRoute from '../../routes/getPodsRoute.ts';

const LdpApiService = {
  name: 'ldp.api' as const,
  settings: {
    baseUrl: null
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
    const { baseUrl } = this.settings;
    const { pathname: basePath } = new URL(baseUrl);

    await this.broker.call('api.addRoute', { route: getPodsRoute(basePath) });
    await this.broker.call('api.addRoute', { route: getCatchAllRoute(basePath) });
  },
  methods: {
    getUriFromSlugParts(slugParts, username) {
      if (!slugParts) slugParts = []; // Root container on pods doesn't have a trailing slash
      return urlJoin(this.settings.baseUrl, username, ...slugParts);
    }
  }
} satisfies ServiceSchema;

export default LdpApiService;

declare global {
  export namespace Moleculer {
    export interface AllServices {
      [LdpApiService.name]: typeof LdpApiService;
    }
  }
}
