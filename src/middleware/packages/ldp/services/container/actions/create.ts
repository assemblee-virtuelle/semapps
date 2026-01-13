import { ActionSchema } from 'moleculer';
import urlJoin from 'url-join';

const CreateAction = {
  visibility: 'public',
  params: {
    title: { type: 'string', optional: true },
    description: { type: 'string', optional: true },
    registration: { type: 'object', optional: true }
  },
  async handler(ctx) {
    let { title, description, registration } = ctx.params;

    const graphName: string = await ctx.call('triplestore.named-graph.create');

    const baseUrl: string = await ctx.call('solid-storage.getBaseUrl');
    const containerUri = urlJoin(baseUrl, graphName);

    await ctx.call('triplestore.insert', {
      resource: {
        '@id': containerUri,
        '@type': ['http://www.w3.org/ns/ldp#Container', 'http://www.w3.org/ns/ldp#BasicContainer'],
        'http://purl.org/dc/terms/title': title,
        'http://purl.org/dc/terms/description': description
      },
      graphName,
      webId: 'system'
    });

    ctx.emit('ldp.container.created', { containerUri, registration });

    return containerUri;
  }
} satisfies ActionSchema;

export default CreateAction;
