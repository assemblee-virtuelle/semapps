const { MIME_TYPES } = require('@semapps/mime-types');

module.exports = {
  settings: {
    documentPredicates: {
      created: 'dc:created',
      updated: 'dc:modified',
      creator: 'dc:creator'
    }
  },
  actions: {
    tagCreatedResource(ctx) {
      const { resourceUri, webId } = ctx.params;
      const now = new Date();
      ctx.call('ldp.resource.patch', {
        resource: {
          '@id': resourceUri,
          [this.settings.documentPredicates.created]: now.toISOString(),
          [this.settings.documentPredicates.updated]: now.toISOString(),
          [this.settings.documentPredicates.creator]: webId
        },
        contentType: MIME_TYPES.JSON,
        webId
      });
    },
    tagUpdatedResource(ctx) {
      const { resourceUri, webId } = ctx.params;
      const now = new Date();
      ctx.call('ldp.resource.patch', {
        resource: {
          '@id': resourceUri,
          [this.settings.documentPredicates.updated]: now.toISOString(),
        },
        contentType: MIME_TYPES.JSON,
        webId
      });
    }
  },
  events: {
    async 'ldp.resource.created'(ctx) {
      const { resourceUri, webId } = ctx.params;
      this.actions.tagCreatedResource(
        {
          resourceUri,
          webId,
        },
        { parentCtx: ctx }
      );
    },
    async 'ldp.resource.updated'(ctx) {
      const { resourceUri, newData, oldData, webId } = ctx.params;

      // Do not update modified date if it is being changed here (prevent infinite loop)
      if( newData[this.settings.documentPredicates.updated] === oldData[this.settings.documentPredicates.updated] ) {
        this.actions.tagUpdatedResource(
          {
            resourceUri,
            webId,
          },
          { parentCtx: ctx }
        );
      }
    }
  }
};
