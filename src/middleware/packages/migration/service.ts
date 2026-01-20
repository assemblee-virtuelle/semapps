import { getAclUriFromResourceUri } from '@semapps/webacl';
import { ServiceSchema } from 'moleculer';

const MigrationService = {
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
    replacePredicate: {
      async handler(ctx) {
        const { oldPredicate, newPredicate, dataset } = ctx.params;

        if (!oldPredicate.startsWith('http'))
          throw new Error(`oldPredicate must be a full URI. Received: ${oldPredicate}`);
        if (!newPredicate.startsWith('http'))
          throw new Error(`newPredicate must be a full URI. Received: ${oldPredicate}`);

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
    },

    updateReferences: {
      async handler(ctx) {
        const { oldUri, newUri, dataset } = ctx.params;

        this.logger.info(`Updating references from ${oldUri} to ${newUri}...`);

        // Change all references in default graph
        await ctx.call('triplestore.update', {
          query: `
            DELETE { ?s ?p <${oldUri}> }
            INSERT { ?s ?p <${newUri}> }
            WHERE { ?s ?p <${oldUri}> }
          `,
          dataset,
          webId: 'system'
        });

        // Change all references in named graphs
        await ctx.call('triplestore.update', {
          query: `
            DELETE { GRAPH ?g { ?s ?p <${oldUri}> } }
            INSERT { GRAPH ?g { ?s ?p <${newUri}> } }
            WHERE { GRAPH ?g { ?s ?p <${oldUri}> } }
          `,
          dataset,
          webId: 'system'
        });

        // Change all references in WebACL graph
        await ctx.call('triplestore.update', {
          query: `
            WITH <${await ctx.call('triplestore.dataset.getWacGraph')}>
            DELETE { ?s ?p <${oldUri}> }
            INSERT { ?s ?p <${newUri}> }
            WHERE { ?s ?p <${oldUri}> }
          `,
          dataset,
          webId: 'system'
        });

        await this.actions.moveAclRights({ newUri, oldUri }, { parentCtx: ctx });
      }
    },

    moveAclGroup: {
      async handler(ctx) {
        const { oldGroupUri, newGroupUri, dataset } = ctx.params;

        this.logger.info(`Moving ACL group ${oldGroupUri} to ${newGroupUri}...`);

        await ctx.call('triplestore.update', {
          query: `
            WITH <${await ctx.call('triplestore.dataset.getWacGraph')}>
            DELETE { <${oldGroupUri}> ?p ?o }
            INSERT { <${newGroupUri}> ?p ?o }
            WHERE { <${oldGroupUri}> ?p ?o }
          `,
          dataset,
          webId: 'system'
        });

        await ctx.call('triplestore.update', {
          query: `
            WITH <${await ctx.call('triplestore.dataset.getWacGraph')}>
            DELETE { ?s ?p <${oldGroupUri}> }
            INSERT { ?s ?p <${newGroupUri}> }
            WHERE { ?s ?p <${oldGroupUri}> }
          `,
          dataset,
          webId: 'system'
        });

        await this.actions.moveAclRights({ newUri: newGroupUri, oldUri: oldGroupUri, dataset }, { parentCtx: ctx });
      }
    },

    moveAclRights: {
      async handler(ctx) {
        const { oldUri, newUri, dataset } = ctx.params;

        for (const right of ['Read', 'Append', 'Write', 'Control']) {
          const oldAclUri = `${getAclUriFromResourceUri(this.settings.baseUrl, oldUri)}#${right}`;
          const newAclUri = `${getAclUriFromResourceUri(this.settings.baseUrl, newUri)}#${right}`;

          this.logger.info(`Moving ACL rights ${oldAclUri} to ${newAclUri}...`);

          await ctx.call('triplestore.update', {
            query: `
              WITH <${await ctx.call('triplestore.dataset.getWacGraph')}>
              DELETE { <${oldAclUri}> ?p ?o }
              INSERT { <${newAclUri}> ?p ?o }
              WHERE { <${oldAclUri}> ?p ?o }
            `,
            dataset,
            webId: 'system'
          });
        }
      }
    },

    clearUserRights: {
      async handler(ctx) {
        const { userUri, dataset } = ctx.params;

        // Remove user from all WebACL groups he may be member of
        await ctx.call('triplestore.update', {
          query: `
            WITH <${await ctx.call('triplestore.dataset.getWacGraph')}>
            DELETE { ?groupUri <http://www.w3.org/2006/vcard/ns#hasMember> <${userUri}> }
            WHERE { ?groupUri <http://www.w3.org/2006/vcard/ns#hasMember> <${userUri}> }
          `,
          dataset,
          webId: 'system'
        });

        // Remove all authorization given specifically to this user
        await ctx.call('triplestore.update', {
          query: `
            WITH <${await ctx.call('triplestore.dataset.getWacGraph')}>
            DELETE { ?authorizationUri <http://www.w3.org/ns/auth/acl#agent> <${userUri}> }
            WHERE { ?authorizationUri <http://www.w3.org/ns/auth/acl#agent> <${userUri}> }
          `,
          dataset,
          webId: 'system'
        });
      }
    }
  }
} satisfies ServiceSchema;

export default MigrationService;

declare global {
  export namespace Moleculer {
    export interface AllServices {
      [MigrationService.name]: typeof MigrationService;
    }
  }
}
