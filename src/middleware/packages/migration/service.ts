import { getAclUriFromResourceUri } from '@semapps/webacl';
import { getContainerFromUri } from '@semapps/ldp';
import { ServiceSchema, defineAction } from 'moleculer';

const MigrationSchema = {
  name: 'migration' as const,
  settings: {
    baseUrl: undefined
  },
  created() {
    if (!this.settings.baseUrl) {
      throw new Error('The baseUrl setting of the migration service is mandatory');
    }
  },
  actions: {
    replacePredicate: defineAction({
      async handler(ctx) {
        const { oldPredicate, newPredicate, dataset } = ctx.params;

        // @ts-expect-error TS(2339): Property 'startsWith' does not exist on type 'neve... Remove this comment to see the full error message
        if (!oldPredicate.startsWith('http'))
          throw new Error(`oldPredicate must be a full URI. Received: ${oldPredicate}`);
        // @ts-expect-error TS(2339): Property 'startsWith' does not exist on type 'neve... Remove this comment to see the full error message
        if (!newPredicate.startsWith('http'))
          throw new Error(`newPredicate must be a full URI. Received: ${oldPredicate}`);

        // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
        this.logger.info(`Replacing predicate ${oldPredicate} with ${newPredicate}...`);

        await ctx.call('triplestore.update', {
          query: `
            DELETE { ?s <${oldPredicate}> ?o . }
            INSERT { ?s <${newPredicate}> ?o . }
            WHERE { ?s <${oldPredicate}> ?o . }
          `,
          dataset,
          webId: 'system'
        });
      }
    }),

    moveResourcesToContainer: defineAction({
      async handler(ctx) {
        const { oldContainerUri, newContainerUri, dataset } = ctx.params;

        const resourcesUris = await ctx.call('ldp.container.getUris', { containerUri: oldContainerUri });

        for (let oldResourceUri of resourcesUris) {
          const newResourceUri = oldResourceUri.replace(oldContainerUri, newContainerUri);

          // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
          await this.actions.moveResource({ oldResourceUri, newResourceUri, dataset }, { parentCtx: ctx });

          // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
          this.logger.info(
            `All resources moved. You should consider deleting the old container with this command: call ldp.container.delete --containerUri ${oldContainerUri} --webId system`
          );
        }
      }
    }),

    moveResource: defineAction({
      async handler(ctx) {
        const { oldResourceUri, newResourceUri, dataset } = ctx.params;

        // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
        this.logger.info(`Moving resource ${oldResourceUri} to ${newResourceUri}...`);

        await ctx.call('triplestore.update', {
          query: `
            DELETE { <${oldResourceUri}> ?p ?o  }
            INSERT { <${newResourceUri}> ?p ?o }
            WHERE { <${oldResourceUri}> ?p ?o }
          `,
          dataset,
          webId: 'system'
        });

        await ctx.call('triplestore.update', {
          query: `
            DELETE { ?s ?p <${oldResourceUri}> }
            INSERT { ?s ?p <${newResourceUri}> }
            WHERE { ?s ?p <${oldResourceUri}> }
          `,
          dataset,
          webId: 'system'
        });

        await ctx.call('triplestore.update', {
          query: `
            WITH <http://semapps.org/webacl>
            DELETE { ?s ?p <${oldResourceUri}> }
            INSERT { ?s ?p <${newResourceUri}> }
            WHERE { ?s ?p <${oldResourceUri}> }
          `,
          dataset,
          webId: 'system'
        });

        const oldContainerUri = getContainerFromUri(oldResourceUri);
        const newContainerUri = getContainerFromUri(newResourceUri);

        await ctx.call('triplestore.update', {
          query: `
            PREFIX ldp: <http://www.w3.org/ns/ldp#>
            DELETE { <${oldContainerUri}> ldp:contains <${newResourceUri}> }
            INSERT { <${newContainerUri}> ldp:contains <${newResourceUri}> }
            WHERE { <${oldContainerUri}> ldp:contains <${newResourceUri}> }
          `,
          dataset,
          webId: 'system'
        });

        // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
        await this.actions.moveAclRights({ newResourceUri, oldResourceUri, dataset }, { parentCtx: ctx });
      }
    }),

    moveAclGroup: defineAction({
      async handler(ctx) {
        const { oldGroupUri, newGroupUri, dataset } = ctx.params;

        // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
        this.logger.info(`Moving ACL group ${oldGroupUri} to ${newGroupUri}...`);

        await ctx.call('triplestore.update', {
          query: `
            WITH <http://semapps.org/webacl>
            DELETE { <${oldGroupUri}> ?p ?o }
            INSERT { <${newGroupUri}> ?p ?o }
            WHERE { <${oldGroupUri}> ?p ?o }
          `,
          dataset,
          webId: 'system'
        });

        await ctx.call('triplestore.update', {
          query: `
            WITH <http://semapps.org/webacl>
            DELETE { ?s ?p <${oldGroupUri}> }
            INSERT { ?s ?p <${newGroupUri}> }
            WHERE { ?s ?p <${oldGroupUri}> }
          `,
          dataset,
          webId: 'system'
        });

        // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
        await this.actions.moveAclRights(
          { newResourceUri: newGroupUri, oldResourceUri: oldGroupUri, dataset },
          { parentCtx: ctx }
        );
      }
    }),

    moveAclRights: defineAction({
      async handler(ctx) {
        const { oldResourceUri, newResourceUri, dataset } = ctx.params;

        for (const right of ['Read', 'Append', 'Write', 'Control']) {
          // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
          const oldResourceAclUri = `${getAclUriFromResourceUri(this.settings.baseUrl, oldResourceUri)}#${right}`;
          // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
          const newResourceAclUri = `${getAclUriFromResourceUri(this.settings.baseUrl, newResourceUri)}#${right}`;

          // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
          this.logger.info(`Moving ACL rights ${oldResourceAclUri} to ${newResourceAclUri}...`);

          await ctx.call('triplestore.update', {
            query: `
              WITH <http://semapps.org/webacl>
              DELETE { <${oldResourceAclUri}> ?p ?o }
              INSERT { <${newResourceAclUri}> ?p ?o }
              WHERE { <${oldResourceAclUri}> ?p ?o }
            `,
            dataset,
            webId: 'system'
          });
        }
      }
    }),

    clearUserRights: defineAction({
      async handler(ctx) {
        const { userUri, dataset } = ctx.params;

        // Remove user from all WebACL groups he may be member of
        await ctx.call('triplestore.update', {
          query: `
            WITH <http://semapps.org/webacl>
            DELETE { ?groupUri <http://www.w3.org/2006/vcard/ns#hasMember> <${userUri}> }
            WHERE { ?groupUri <http://www.w3.org/2006/vcard/ns#hasMember> <${userUri}> }
          `,
          dataset,
          webId: 'system'
        });

        // Remove all authorization given specifically to this user
        await ctx.call('triplestore.update', {
          query: `
            WITH <http://semapps.org/webacl>
            DELETE { ?authorizationUri <http://www.w3.org/ns/auth/acl#agent> <${userUri}> }
            WHERE { ?authorizationUri <http://www.w3.org/ns/auth/acl#agent> <${userUri}> }
          `,
          dataset,
          webId: 'system'
        });
      }
    })
  }
} satisfies ServiceSchema;

export default MigrationSchema;

declare global {
  export namespace Moleculer {
    export interface AllServices {
      [MigrationSchema.name]: typeof MigrationSchema;
    }
  }
}
