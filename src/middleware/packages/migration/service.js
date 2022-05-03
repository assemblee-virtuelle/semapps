const { getAclUriFromResourceUri } = require('@semapps/webacl');

module.exports = {
  name: 'migration',
  actions: {
    async replacePredicate(ctx) {
      const { oldPredicate, newPredicate, dataset } = ctx.params;

      if( !oldPredicate.startsWith('http') ) throw new Error('oldPredicate must be a full URI. Received: ' + oldPredicate);
      if( !newPredicate.startsWith('http') ) throw new Error('newPredicate must be a full URI. Received: ' + oldPredicate);

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

      for (let right of ['Read', 'Append', 'Write', 'Control']) {
        const oldResourceAclUri = getAclUriFromResourceUri(this.settings.baseUrl, oldResourceUri) + '#' + right;
        const newResourceAclUri = getAclUriFromResourceUri(this.settings.baseUrl, newResourceUri) + '#' + right;

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
  }
};
