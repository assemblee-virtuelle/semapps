import { Cachers } from 'moleculer';
let cacher;

// It has been suggested to put this middleware in Moleculer core code:
// https://github.com/moleculerjs/moleculer/issues/892
const CacherMiddleware = opts => ({
  name: 'CacherMiddleware' as const,
  created(broker) {
    if (opts) {
      broker.cacher = Cachers.resolve(opts);
      broker.cacher.init(broker);
      cacher = broker.cacher.middleware();
    }
  },
  // TODO see why this is not called by Moleculer
  // async stopped(broker) {
  //   if (opts) {
  //     await broker.cacher.close();
  //   }
  // },
  localAction(next, action) {
    if (cacher) {
      return cacher.localAction(next, action);
    }
    return next;
  }
});

export default CacherMiddleware;
