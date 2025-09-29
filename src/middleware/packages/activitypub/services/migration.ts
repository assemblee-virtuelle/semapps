import { ServiceSchema } from 'moleculer';

const ActivitypubMigrationSchema = {
  name: 'activitypub.migration' as const,
  actions: {
    updateCollectionsOptions: {
      async handler(ctx) {
        await ctx.call('activitypub.follow.updateCollectionsOptions');
        await ctx.call('activitypub.inbox.updateCollectionsOptions');
        await ctx.call('activitypub.outbox.updateCollectionsOptions');
        await ctx.call('activitypub.like.updateCollectionsOptions');
        await ctx.call('activitypub.reply.updateCollectionsOptions');
      }
    },

    addCollectionsToContainer: {
      // This shouldn't be used in Pod provider config
      async handler(ctx) {
        const collectionsContainerUri = await ctx.call('activitypub.collection.getContainerUri');

        this.logger.info(`Attaching all collections to ${collectionsContainerUri}`);

        await ctx.call('triplestore.update', {
          query: `
            PREFIX as: <https://www.w3.org/ns/activitystreams#>
            PREFIX ldp: <http://www.w3.org/ns/ldp#>
            INSERT {
              GRAPH <${collectionsContainerUri}> {
                <${collectionsContainerUri}> ldp:contains ?collectionUri
              }
            }
            WHERE {
              GRAPH ?g {
                ?collectionUri a as:Collection
              }
            }
          `,
          webId: 'system'
        });
      }
    }
  }
} satisfies ServiceSchema;

export default ActivitypubMigrationSchema;

declare global {
  export namespace Moleculer {
    export interface AllServices {
      [ActivitypubMigrationSchema.name]: typeof ActivitypubMigrationSchema;
    }
  }
}
