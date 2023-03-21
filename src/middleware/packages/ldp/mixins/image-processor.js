const sharp = require("sharp");
const { MIME_TYPES } = require("@semapps/mime-types");
const { defaultToArray } = require("../utils");

const SUPPORTED_IMAGES_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

module.exports = {
  settings: {
    imageProcessor: {
      maxWidth: 1900,
      maxHeight: 1000,
      jpeg: {
        quality: 85
      },
      png: {
        compressionLevel: 8,
      },
      webp: {
        quality: 85
      }
    }
  },
  actions: {
    async processImage(ctx) {
      let { resourceUri } = ctx.params;

      const metadata = await ctx.call('ldp.resource.get', {
        resourceUri,
        jsonContext: { '@vocab': 'http://semapps.org/ns/core#' },
        accept: MIME_TYPES.JSON,
        forceSemantic: true,
        webId: 'system'
      });

      try {
        if (metadata['@type'] === 'File' && SUPPORTED_IMAGES_MIME_TYPES.includes(metadata.mimeType)) {
          let image = await sharp(metadata.localPath);

          const { width, height, format } = await image.metadata();

          if (width > this.settings.imageProcessor.maxWidth || height > this.settings.imageProcessor.maxHeight) {
            const maxSize = this.getMaxSize(width, height);
            image = image.resize({ width: maxSize.width, height: maxSize.height });
          }

          switch (format) {
            case 'jpeg':
              image = await image.jpeg(this.settings.imageProcessor.jpeg || {});
              break;
            case 'png':
              image = await image.png(this.settings.imageProcessor.png || {});
              break;
            case 'webp':
              image = await image.webp(this.settings.imageProcessor.webp || {});
              break;
          }

          // We cannot write directly to the same file as input, so write to a buffer first
          const buffer = await image.toBuffer();
          await sharp(buffer).toFile(metadata.localPath);
        }
      } catch(e) {
        this.logger.warn(`Image processing failed (${e.message})`);
      }
    },
    async processAllImages(ctx) {
      const { webId } = ctx.params;
      const container = await this.actions.list({ webId, forceSemantic: true }, { parentCtx: ctx });
      if (container['ldp:contains']) {
        const resources = defaultToArray(container['ldp:contains']);
        this.logger.info(`Processing ${resources.length} images...`);
        for (let resource of defaultToArray(container['ldp:contains'])) {
          this.logger.info('Processing image ' + resource.id + '...');
          await this.actions.processImage({ resourceUri: resource.id }, { parentCtx: ctx });
        }
      }
      this.logger.info('Finished !');
    }
  },
  methods: {
    getMaxSize(width, height) {
      const ratio = Math.min(this.settings.imageProcessor.maxWidth / width, this.settings.imageProcessor.maxHeight / height);
      return { width: Math.round(width * ratio), height: Math.round(height * ratio) };
    }
  },
  hooks: {
    after: {
      async create(ctx, res) {
        await this.actions.processImage({
          resourceUri: res.resourceUri
        });
        return res;
      }
    }
  }
}