import { MIME_TYPES } from '@semapps/mime-types';
import { defineAction } from 'moleculer';

const Schema = defineAction({
  visibility: 'public',
  params: {
    containerUri: { type: 'string' },
    title: { type: 'string', optional: true },
    description: { type: 'string', optional: true },
    options: { type: 'object', optional: true },
    webId: { type: 'string', optional: true }
  },
  async handler(ctx) {
    const { containerUri, title, description, options } = ctx.params;
    // @ts-expect-error TS(2339): Property 'webId' does not exist on type '{}'.
    const webId = ctx.params.webId || ctx.meta.webId || 'anon';

    await ctx.call('triplestore.insert', {
      resource: {
        '@id': containerUri,
        '@type': ['http://www.w3.org/ns/ldp#Container', 'http://www.w3.org/ns/ldp#BasicContainer'],
        'http://purl.org/dc/terms/title': title,
        'http://purl.org/dc/terms/description': description
      },
      contentType: MIME_TYPES.JSON,
      webId
    });

    ctx.emit('ldp.container.created', { containerUri, options, webId });
  }
});

export default Schema;
