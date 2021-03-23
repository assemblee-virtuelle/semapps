const Cachers = require('moleculer').Cachers;

let cacherMiddleware;

// It has been suggested to put this middleware in Moleculer core code:
// https://github.com/moleculerjs/moleculer/issues/892
const CacherMiddleware = opts => ({
  name: "CacherMiddleware",
  created(broker) {
    if( opts ) {
      broker.cacher = Cachers.resolve(opts);
      broker.cacher.init(broker);
      cacherMiddleware = broker.cacher.middleware();
    }
  },
  localAction(next, action) {
    if( cacherMiddleware ) {
      return cacherMiddleware(next, action);
    } else {
      return next;
    }
  }
});

module.exports = CacherMiddleware;
