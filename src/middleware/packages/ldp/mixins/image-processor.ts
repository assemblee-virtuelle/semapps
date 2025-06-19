// @ts-expect-error TS(7016): Could not find a declaration file for module 'shar... Remove this comment to see the full error message
import sharp from 'sharp';
import { MIME_TYPES } from '@semapps/mime-types';
import { ServiceSchema, defineAction } from 'moleculer';
import { arrayOf } from '../utils.ts';

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
    processImage: defineAction({
      async handler(ctx) {
        const { resourceUri } = ctx.params;

        const metadata = await ctx.call('ldp.resource.get', {
          resourceUri,
          jsonContext: { '@vocab': 'http://semapps.org/ns/core#' },
          accept: MIME_TYPES.JSON,
          webId: 'system'
        });

        try {
          if (metadata['@type'] === 'File' && SUPPORTED_IMAGES_MIME_TYPES.includes(metadata.mimeType)) {
            let image = await sharp(metadata.localPath);

            const { width, height, format } = await image.metadata();

            // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
            if (width > this.settings.imageProcessor.maxWidth || height > this.settings.imageProcessor.maxHeight) {
              // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
              const maxSize = this.getMaxSize(width, height);
              image = image.resize({ width: maxSize.width, height: maxSize.height });
            }

            switch (format) {
              case 'jpeg':
                // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
                image = await image.jpeg(this.settings.imageProcessor.jpeg || {});
                break;
              case 'png':
                // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
                image = await image.png(this.settings.imageProcessor.png || {});
                break;
              case 'webp':
                // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
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
          // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
          this.logger.warn(`Image processing failed (${e.message})`);
        }
      }
    }),

    processAllImages: defineAction({
      async handler(ctx) {
        const { webId } = ctx.params;
        // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
        const container = await this.actions.list({ webId }, { parentCtx: ctx });
        if (container['ldp:contains']) {
          const resources = arrayOf(container['ldp:contains']);
          // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
          this.logger.info(`Processing ${resources.length} images...`);
          for (const resource of resources) {
            // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
            this.logger.info(`Processing image ${resource.id}...`);
            // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
            await this.actions.processImage({ resourceUri: resource.id }, { parentCtx: ctx });
          }
        }
        // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
        this.logger.info('Finished !');
      }
    })
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
        // @ts-expect-error TS(2339): Property 'processImage' does not exist on type 'st... Remove this comment to see the full error message
        await this.actions.processImage({ resourceUri: res.resourceUri }, { parentCtx: ctx });
        return res;
      }
    }
  }
  // @ts-expect-error TS(1360): Type '{ settings: { imageProcessor: { maxWidth: nu... Remove this comment to see the full error message
} satisfies ServiceSchema;

export default Schema;
