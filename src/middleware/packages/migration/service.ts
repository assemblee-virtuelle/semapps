import { getAclUriFromResourceUri } from '@semapps/webacl';
import { getContainerFromUri } from '@semapps/ldp';

const MigrationSchema = {
  name: 'migration',
  settings: {
    baseUrl: undefined
  },
  created() {
    if (!this.settings.baseUrl) {
      throw new Error('The baseUrl setting of the migration service is mandatory');
    }
  },
  actions: {
    async replacePredicate(ctx) {
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
    },
    async moveResourcesToContainer(ctx) {
      const { oldContainerUri, newContainerUri, dataset } = ctx.params;

      const resourcesUris = await ctx.call('ldp.container.getUris', { containerUri: oldContainerUri });

      for (let oldResourceUri of resourcesUris) {
        const newResourceUri = oldResourceUri.replace(oldContainerUri, newContainerUri);

        await this.actions.moveResource({ oldResourceUri, newResourceUri, dataset }, { parentCtx: ctx });

        this.logger.info(
          `All resources moved. You should consider deleting the old container with this command: call ldp.container.delete --containerUri ${oldContainerUri} --webId system`
        );
      }
    },
    async moveResource(ctx) {
      const { oldResourceUri, newResourceUri, dataset } = ctx.params;

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

      await this.actions.moveAclRights({ newResourceUri, oldResourceUri, dataset }, { parentCtx: ctx });
    },
    async moveAclGroup(ctx) {
      const { oldGroupUri, newGroupUri, dataset } = ctx.params;

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

      await this.actions.moveAclRights(
        { newResourceUri: newGroupUri, oldResourceUri: oldGroupUri, dataset },
        { parentCtx: ctx }
      );
    },
    async moveAclRights(ctx) {
      const { oldResourceUri, newResourceUri, dataset } = ctx.params;

      for (const right of ['Read', 'Append', 'Write', 'Control']) {
        const oldResourceAclUri = `${getAclUriFromResourceUri(this.settings.baseUrl, oldResourceUri)}#${right}`;
        const newResourceAclUri = `${getAclUriFromResourceUri(this.settings.baseUrl, newResourceUri)}#${right}`;

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
    },
    async clearUserRights(ctx) {
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
  }
};

export default MigrationSchema;
