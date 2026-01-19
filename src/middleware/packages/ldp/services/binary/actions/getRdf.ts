import { ActionSchema } from 'moleculer';
import { Binary } from '../../../types.ts';

const getRdfAction = {
  visibility: 'public',
  params: {
    resourceUri: { type: 'string' }
  },
  async handler(ctx) {
    const { resourceUri } = ctx.params;

    const binary: Binary = await this.settings.adapter.getBinary(resourceUri);

    return {
      '@context': await ctx.call('jsonld.context.get'),
      id: resourceUri,
      type: [
        'https://www.w3.org/ns/iana/media-types/application/octet-stream#Resource',
        `https://www.w3.org/ns/iana/media-types/${binary.mimeType}#Resource`
      ],
      'stat:size': `${binary.size}`,
      'stat:mtime': binary.time?.toISOString()
    };
  }
} satisfies ActionSchema;

export default getRdfAction;
