---
title: ActivitiesHandlerMixin
---

Watch for ActivityPub activities matching certain patterns and easily handle side effects.

## Usage

```js
const { ActivitiesHandlerMixin, ACTIVITY_TYPES, OBJECT_TYPES, matchActivity } = require('@semapps/activitypub');

module.exports = {
  mixins: [ActivitiesHandlerMixin],
  // Low priorities will make the handler be executed before others. By default `10`.
  priority: 5,
  activities: {
    joinEvent: {
      match: {
        type: ACTIVITY_TYPES.JOIN,
        object: {
          type: OBJECT_TYPES.EVENT
        }
      },
      async onEmit(ctx, activity, emitterUri) {
        // Handle side effects on emit
      },
      async onReceive(ctx, activity, recipientUri) {
        // Handle side effects on receive
      }
    },
    myAnnounceActivity: {
      async match(activity, fetcher) {
        if (activity.actor !== 'http://localhost:3000/myself') {
          return { match: false, dereferencedActivity: activity };
        } else {
          return await matchActivity({ type: ACTIVITY_TYPES.ANNOUNCE }, activity, fetcher);
        }
      },
      async onEmit(ctx, activity, emitterUri) {
        // Handle side effects on emit
      },
      async onReceive(ctx, activity, recipientUri) {
        // Handle side effects on receive
      }
    }
    contactRequest: {
      match: CONTACT_REQUEST,
      // This generates a function that is called on each ActivityGrant of the activity's capability.
      async capabilityGrantMatchFnGenerator({ recipientUri, activity }) {

        return async grant => {
          // Verify that the recipient issued the grant with the following structure.
          const { match } = await matchActivity(
            {
              type: ACTIVITY_TYPES.OFFER,
              to: recipientUri,
              target: recipientUri,
              object: {
                type: ACTIVITY_TYPES.ADD,
                object: {
                  type: OBJECT_TYPES.PROFILE
                }
              }
            },
            grant,
            uri => ({ id: uri }) // The URIs here are not resolved further.
          );
          return match;
        };
      },
      async onEmit(ctx, activity, emitterUri) { },
      async onReceive(ctx, activity, recipientUri) { }
    }
  }
};
```

> The `activity` object passed to the `onEmit` and `onReceive` functions is dereferenced according to the `match` pattern. In the above case, the Event object will be dereferenced, even if on the original activity, it included only an URI. If you use a function for the `match` property, the value you return will passed to the `onEmit` and `onReceive` functions. The `match` pattern supports asterisks `*` as well.

> To support [capabilities](../crypto/verifiable-credentials.md#issuing-and-verifying-capabilities) in an activity handler, you can add the `capabilityGrantMatchFnGenerator` property. This property must return a function that takes an `ActivityGrant` as input and returns `true` or `false` based on whether the grant matches. The function is invoked for each `ActivityGrant`, and every capability in the chain must have at least one matching grant. By including `capabilityGrantMatchFnGenerator`, the handler ensures that only activities with valid grants are processed. The handler internally verifies the capabilities and ensures that each capability in the chain has an ActivityGrant matching the activity.
