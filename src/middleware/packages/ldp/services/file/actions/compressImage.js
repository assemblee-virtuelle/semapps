const sharp = require('sharp');
const {MIME_TYPES} = require("@semapps/mime-types");

const imagesMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']

module.exports = {
  visibility: 'public',
  params: {
    resourceUri: { type: 'string', optional: true },
    metadata: { type: 'object', optional: true }
  },
  async handler(ctx) {
    let { resourceUri, metadata } = ctx.params;

    if (!metadata) {
      if (!resourceUri) {
        throw new Error('ldp.file.compressImage require a resourceUri or metadata param');
      }

      metadata = await ctx.call('ldp.resource.get', {
        resourceUri,
        jsonContext: { '@vocab': 'http://semapps.org/ns/core#' },
        accept: MIME_TYPES.JSON,
        forceSemantic: true,
        webId: 'system'
      });
    }

    console.log('metadata', metadata)

    if (metadata['@type'] !== 'semapps:File') {
      throw new Error(resourceUri + ' is not a file, cannot compress.');
    }

    if (imagesMimeTypes.includes(metadata.mimetype)) {
      throw new Error(resourceUri + ' is not an allowed image type, cannot compress.');
    }

    const { width, height } = await sharp(metadata.localPath).metadata();

    if (width > 1000) {
      // We cannot write directly to the input file, so write to a buffer first
      const buffer = await sharp(metadata.localPath).resize({ width: 1000 }).toBuffer();
      await sharp(buffer).toFile(metadata.localPath);
    }
  }
};
