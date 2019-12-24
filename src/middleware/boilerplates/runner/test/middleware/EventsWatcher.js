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
    return function(payload, sender, eventName) {
      event.service.broker.latestEvent = eventName;
      return next(payload, sender, eventName);
    };
  },

  created(broker) {
    // Add a new method to broker object
    broker.watchForEvent = eventName => {
      return new Promise(resolve => {
        setInterval(() => {
          // console.log('broker.latestEvent', broker.latestEvent, eventName);
          if (broker.latestEvent === eventName) {
            // console.log('RESOLVE !', eventName);
            broker.latestEvent = null;
            resolve();
          }
        }, 500);
      });
    };
  }
};

module.exports = EventsWatcher;
