import { hasType, getId } from '@semapps/ldp';
import { ACTIVITY_TYPES } from '../../../../constants.ts';

// const removeReadRights = async ({ ctx, recipientUris, resourceUri, skipObjectsWatcher, anon }) => {
//   if (recipientUris === 0 && !anon) return;
//   await ctx.call(
//     'webacl.resource.removeRights',
//     {
//       resourceUri,
//       rights: {
//         ...(anon && { anon: { read: true } }),
//         ...(recipientUris && {
//           uri: recipientUris,
//           read: true
//         })
//       },
//       webId: 'system'
//     },
//     {
//       meta: {
//         skipObjectsWatcher
//       }
//     }
//   );
// };

const addReadRights = async ({ ctx, recipientUris, resourceUri, skipObjectsWatcher, anon }: any) => {
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
  async onEmit(ctx: any, activity: any) {
    const activityUri = getId(activity);
    const newRecipients = await ctx.call('activitypub.activity.getRecipients', { activity });
    const activityIsPublic = await ctx.call('activitypub.activity.isPublic', { activity });
    /** @type {string} */
    const objectUri = typeof activity.object === 'string' ? activity.object : activity.object?.id;

    // When a new activity is created, ensure the emitter has read rights as well.
    // Don't do that on podProvider config, because the Pod owner already has all rights.
    if (!this.settings.podProvider) {
      if (!newRecipients.includes(activity.actor)) newRecipients.push(activity.actor);
    }

    // Give read rights to the recipients, unless the activity is transient
    if (!activityUri.includes('#')) {
      await addReadRights({
        ctx,
        resourceUri: activityUri,
        recipientUris: newRecipients,
        skipObjectsWatcher: true,
        anon: activityIsPublic
      });
    }

    // If Create or Update activity, also give rights to the created object.
    if (hasType(activity, ACTIVITY_TYPES.CREATE) || hasType(activity, ACTIVITY_TYPES.UPDATE)) {
      try {
        await addReadRights({
          ctx,
          resourceUri: objectUri,
          recipientUri: newRecipients,
          skipObjectsWatcher: true,
          anon: activityIsPublic
        });
      } catch (e) {
        if (e.code === 404) {
          // Ignore cases when the object is deleted before the Create or Update activity have been sent
          this.logger.warn(`Could not add read rights on object ${objectUri} because it does not exist anymore.`);
        } else {
          throw e;
        }
      }
    }

    // TODO Decide if we keep this special handling of Update activities that can have unexpected results
    // If Update activity, we need to remove read rights of former recipients, and give read rights to new recipients.
    // else if (hasType(activity, ACTIVITY_TYPES.UPDATE)) {
    //   // const rights = await ctx.call('webacl.resource.getRights', { resourceUri: objectUri });
    //   // const wasPublic = rights?.anon?.read;
    //   const previousRecipients = await ctx.call('webacl.resource.getUsersWithReadRights', {
    //     resourceUri: objectUri
    //   });
    //
    //   // We add rights to all new recipients.
    //   //  ~~*And* if the object was private before, we send out a `Create` activity instead,
    //   //  by not skipping the objectWatcher that handles this.~~
    //   const addedRecipients = newRecipients.filter(r => !previousRecipients.includes(r));
    //   await addReadRights({
    //     ctx,
    //     resourceUri: objectUri,
    //     recipientUris: addedRecipients,
    //     skipObjectsWatcher: true, // !wasPublic, // TODO: Maybe this should be false...
    //     anon: activityIsPublic
    //   });
    //
    //   // We remove rights from all actors that aren't recipients anymore.
    //   //  *And* we do not skip the object-watcher middleware, to send `Delete` activities
    //   //  to actors that cannot see the object anymore.
    //   const removedRecipients = previousRecipients.filter(r => !newRecipients.includes(r));
    //   if (removedRecipients.length > 0 || !activityIsPublic)
    //     await removeReadRights({
    //       ctx,
    //       resourceUri: objectUri,
    //       recipientUris: removedRecipients,
    //       skipObjectsWatcher: false,
    //       anon: !activityIsPublic
    //     });
    // }
  }
};

export default setRightsHandler;
