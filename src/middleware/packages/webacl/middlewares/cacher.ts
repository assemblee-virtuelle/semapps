import { Cachers } from 'moleculer';

let cacher: any;

// It has been suggested to put this middleware in Moleculer core code:
// https://github.com/moleculerjs/moleculer/issues/892
const CacherMiddleware = (opts: any) => ({
  name: 'CacherMiddleware' as const,

  created(broker: any) {
    if (opts) {
      // @ts-expect-error TS(2339): Property 'resolve' does not exist on type 'typeof ... Remove this comment to see the full error message
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
  localAction(next: any, action: any) {
    if (cacher) {
      return cacher.localAction(next, action);
    }
    return next;
  }
});

export default CacherMiddleware;
