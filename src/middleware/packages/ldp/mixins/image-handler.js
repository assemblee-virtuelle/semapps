const sharp = require("sharp");
const { MIME_TYPES } = require("@semapps/mime-types");
const SUPPORTED_IMAGES_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

module.exports = {
  settings: {
    imageHandler: {
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
    async handleImage(ctx) {
      let { resourceUri } = ctx.params;

      const metadata = await ctx.call('ldp.resource.get', {
        resourceUri,
        accept: MIME_TYPES.JSON,
        forceSemantic: true,
        webId: 'system'
      });

      if (metadata['@type'] === 'semapps:File' && SUPPORTED_IMAGES_MIME_TYPES.includes(metadata.mimetype)) {
        let image = await sharp(metadata.localPath);

        const { width, height, format } = await image.metadata();

        if (width > this.settings.imageHandler.maxWidth || height > this.settings.imageHandler.maxHeight) {
          const maxSize = this.getMaxSize(width, height);
          image = image.resize({ width: maxSize.width, height: maxSize.height });
        }

        switch(format) {
          case 'jpg':
            image = await image.jpeg(this.settings.imageHandler.jpeg || {});
            break;
          case 'png':
            image = await image.png(this.settings.imageHandler.png || {});
            break;
          case 'webp':
            image = await image.webp(this.settings.imageHandler.webp || {});
            break;
        }

        // We cannot write directly to the same file as input, so write to a buffer first
        const buffer = await image.toBuffer();
        await sharp(buffer).toFile(metadata.localPath);
      }
    },
    async handleAllImages(ctx) {
      await this.actions.list({}, { parentCtx: ctx });
    }
  },
  methods: {
    getMaxSize(width, height) {
      const ratio = Math.min(this.settings.imageHandler.maxWidth / width, this.settings.imageHandler.maxHeight / height);
      return { width: width * ratio, height: height * ratio };
    }
  },
  hooks: {
    after: {
      async create(ctx, res) {
        await this.actions.handleImage({
          resourceUri: res.resourceUri
        })
      }
    }
  }
}