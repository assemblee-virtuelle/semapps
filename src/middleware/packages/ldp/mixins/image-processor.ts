import sharp from 'sharp';
import { MIME_TYPES } from '@semapps/mime-types';
import { arrayOf } from '../utils.ts';
import { ServiceSchema } from 'moleculer';
const SUPPORTED_IMAGES_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const Schema = {
  settings: {
    imageProcessor: {
      maxWidth: 1900,
      maxHeight: 1000,
      jpeg: {
        quality: 85
      },
      png: {
        compressionLevel: 8
      },
      webp: {
        quality: 85
      }
    }
  },
  actions: {
    processImage: {
      async handler(ctx) {
        const { resourceUri } = ctx.params;

        const metadata = await ctx.call('ldp.resource.get', {
          resourceUri,
          jsonContext: { '@vocab': 'http://semapps.org/ns/core#' },
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
              default:
                break;
            }

            // We cannot write directly to the same file as input, so write to a buffer first
            const buffer = await image.toBuffer();
            await sharp(buffer).toFile(metadata.localPath);
          }
        } catch (e) {
          this.logger.warn(`Image processing failed (${e.message})`);
        }
      }
    },

    processAllImages: {
      async handler(ctx) {
        const { webId } = ctx.params;
        const container = await this.actions.list({ webId }, { parentCtx: ctx });
        if (container['ldp:contains']) {
          const resources = arrayOf(container['ldp:contains']);
          this.logger.info(`Processing ${resources.length} images...`);
          for (const resource of resources) {
            this.logger.info(`Processing image ${resource.id}...`);
            await this.actions.processImage({ resourceUri: resource.id }, { parentCtx: ctx });
          }
        }
        this.logger.info('Finished !');
      }
    }
  },
  methods: {
    getMaxSize(width, height) {
      const ratio = Math.min(
        this.settings.imageProcessor.maxWidth / width,
        this.settings.imageProcessor.maxHeight / height
      );
      return { width: Math.round(width * ratio), height: Math.round(height * ratio) };
    }
  },
  hooks: {
    after: {
      async create(ctx, res) {
        await this.actions.processImage({ resourceUri: res.resourceUri }, { parentCtx: ctx });
        return res;
      }
    }
  }
} satisfies Partial<ServiceSchema>;

export default Schema;
