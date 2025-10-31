import { ActionSchema } from 'moleculer';

const Schema = {
  visibility: 'public',
  params: {
    path: { type: 'string', optional: true },
    title: { type: 'string', optional: true },
    description: { type: 'string', optional: true },
    registration: { type: 'object', optional: true }
  },
  async handler(ctx) {
    let { path, title, description, registration } = ctx.params;

    const baseUrl = this.settings.podProvider
      ? await ctx.call('solid-storage.getBaseUrl', { username: ctx.meta.dataset })
      : this.settings.baseUrl;

    const containerUri = await ctx.call('triplestore.named-graph.create', {
      baseUrl,
      slug: this.settings.allowSlugs ? path || registration.path : undefined
    });

    await ctx.call('triplestore.insert', {
      resource: {
        '@id': containerUri,
        '@type': ['http://www.w3.org/ns/ldp#Container', 'http://www.w3.org/ns/ldp#BasicContainer'],
        'http://purl.org/dc/terms/title': title,
        'http://purl.org/dc/terms/description': description
      },
      graphName: containerUri,
      webId: 'system'
    });

    ctx.emit('ldp.container.created', { containerUri, registration });

    return containerUri;
  }
} satisfies ActionSchema;

export default Schema;
