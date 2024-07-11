const { arrayOf, hasType, defaultContainerOptions } = require('@semapps/ldp');
const { ActivitiesHandlerMixin, ACTIVITY_TYPES } = require('@semapps/activitypub');

module.exports = {
  name: 'webacl.activity',
  mixins: [ActivitiesHandlerMixin],
  settings: {
    podProvider: false
  },
  activities: {
    addRights: {
      match: '*',
      priority: 1,
      async onEmit(ctx, activity) {
        const activityUri = activity['@id'] || activity.id;
        const recipients = await ctx.call('activitypub.activity.getRecipients', { activity });

        // When a new activity is created, ensure the emitter has read rights also
        // Don't do that on podProvider config, because the Pod owner already has all rights
        if (!this.settings.podProvider) {
          if (!recipients.includes(activity.actor)) recipients.push(activity.actor);
        }

        // Give read rights to the activity's recipients
        // TODO improve performances by passing all users at once
        // https://github.com/assemblee-virtuelle/semapps/issues/908
        for (const recipientUri of recipients) {
          await ctx.call('webacl.resource.addRights', {
            resourceUri: activityUri,
            additionalRights: {
              user: {
                uri: recipientUri,
                read: true
              }
            },
            webId: 'system'
          });

          // If this is a Create activity, also give rights to the created object
          if (hasType(activity, ACTIVITY_TYPES.CREATE)) {
            await ctx.call('webacl.resource.addRights', {
              resourceUri: typeof activity.object === 'string' ? activity.object : activity.object.id,
              additionalRights: {
                user: {
                  uri: recipientUri,
                  read: true
                }
              },
              webId: 'system'
            });
          }
        }

        // If activity is public, give anonymous read right
        if (await ctx.call('activitypub.activity.isPublic', { activity })) {
          await ctx.call('webacl.resource.addRights', {
            resourceUri: activityUri,
            additionalRights: {
              anon: {
                read: true
              }
            },
            webId: 'system'
          });

          // If this is a Create activity, also give anonymous read right to the created object
          if (hasType(activity, ACTIVITY_TYPES.CREATE)) {
            await ctx.call('webacl.resource.addRights', {
              resourceUri: typeof activity.object === 'string' ? activity.object : activity.object.id,
              additionalRights: {
                anon: {
                  read: true
                }
              },
              webId: 'system'
            });
          }
        }
      }
    }
  }
};
