const { hasType } = require('@semapps/ldp');
const { ACTIVITY_TYPES } = require('../../../../constants');

const removeReadRights = async ({ ctx, recipientUris, resourceUri, skipObjectsWatcher, anon }) => {
  if (recipientUris === 0 && !anon) return;
  await ctx.call(
    'webacl.resource.removeRights',
    {
      resourceUri,
      rights: {
        ...(anon && { anon: { read: true } }),
        ...(recipientUris && {
          uri: recipientUris,
          read: true
        })
      },
      webId: 'system'
    },
    {
      meta: {
        skipObjectsWatcher
      }
    }
  );
};

const addReadRights = async ({ ctx, recipientUris, resourceUri, skipObjectsWatcher, anon }) => {
  if (recipientUris?.length === 0 && !anon) return;
  await ctx.call(
    'webacl.resource.addRights',
    {
      resourceUri,
      additionalRights: {
        ...(anon && { anon: { read: true } }),
        ...(recipientUris && {
          user: {
            uri: recipientUris,
            read: true
          }
        })
      },
      webId: 'system'
    },
    {
      meta: {
        skipObjectsWatcher
      }
    }
  );
};

const setRightsHandler = {
  match: '*',
  priority: 1,
  async onEmit(ctx, activity) {
    const activityUri = activity['@id'] || activity.id;
    const newRecipients = await ctx.call('activitypub.activity.getRecipients', { activity });
    const activityIsPublic = await ctx.call('activitypub.activity.isPublic', { activity });
    /** @type {string} */
    const objectUri = typeof activity.object === 'string' ? activity.object : activity.object?.id;

    // When a new activity is created, ensure the emitter has read rights as well.
    // Don't do that on podProvider config, because the Pod owner already has all rights.
    if (!this.settings.podProvider) {
      if (!newRecipients.includes(activity.actor)) newRecipients.push(activity.actor);
    }

    // Give read rights to the activity's recipients.
    await addReadRights({
      ctx,
      recipientUris: newRecipients,
      skipObjectsWatcher: true,
      resourceUri: activityUri,
      anon: activityIsPublic
    });

    // If Create activity, also give rights to the created object.
    if (hasType(activity, ACTIVITY_TYPES.CREATE)) {
      await addReadRights({
        ctx,
        resourceUri: objectUri,
        recipientUri: newRecipients,
        skipObjectsWatcher: true
      });
    }
    // If Update activity, we need to remove read rights of former recipients, and give read rights to new recipients.
    else if (hasType(activity, ACTIVITY_TYPES.UPDATE)) {
      // const rights = await ctx.call('webacl.resource.getRights', { resourceUri: objectUri });
      // const wasPublic = rights?.anon?.read;
      const previousRecipients = await ctx.call('webacl.resource.getUsersWithReadRights', {
        resourceUri: objectUri
      });

      const removedRecipients = previousRecipients.filter(r => !newRecipients.includes(r));
      const addedRecipients = newRecipients.filter(r => !previousRecipients.includes(r));

      // We add rights to all new recipients.
      //  ~~*And* if the object was private before, we send out a `Create` activity instead,
      //  by not skipping the objectWatcher that handles this.~~
      await addReadRights({
        ctx,
        resourceUri: objectUri,
        recipientUris: addedRecipients,
        skipObjectsWatcher: true, // !wasPublic, // TODO: Maybe this should be false...
        anon: activityIsPublic
      });

      // We remove rights from all actors that aren't recipients anymore.
      //  *And* we do not skip the object-watcher middleware, to send `Delete` activities
      //  to actors that cannot see the object anymore.
      if (removedRecipients.length > 0 || !activityIsPublic)
        await removeReadRights({
          ctx,
          resourceUri: objectUri,
          recipientUris: removedRecipients,
          skipObjectsWatcher: false,
          anon: !activityIsPublic
        });
    }
  }
};

module.exports = setRightsHandler;
