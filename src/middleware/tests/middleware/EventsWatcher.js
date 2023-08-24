/*
 * Middleware which allows the broker to watch for events
 * Adds a watchForEvent() method to the broker object
 *
 * WARNING: localEvent is only called if a service is listening to an event.
 * So if you want to watch for an event which is not being listened to, you
 * need to add the event listener somewhere, even if it does nothing.
 */

const EventsWatcher = {
  localEvent(next, event) {
    return ctx => {
      event.service.broker.latestEventName = ctx.eventName;
      event.service.broker.latestEventParams = ctx.params;
      return next(ctx);
    };
  },

  created(broker) {
    // Add a new method to broker object
    broker.watchForEvent = async eventName => {
      return new Promise(resolve => {
        const timerId = setInterval(() => {
          if (broker.latestEventName === eventName) {
            broker.latestEventName = null;
            clearInterval(timerId);
            resolve(broker.latestEventParams);
          }
        }, 100);
      });
    };
  }
};

module.exports = EventsWatcher;
