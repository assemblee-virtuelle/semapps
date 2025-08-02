import path from 'path';
import fs from 'fs';
import { defineAction } from 'moleculer';
import { getSlugFromUri, getContainerFromUri } from '../../../utils.ts';

const { MoleculerError } = require('moleculer').Errors;

const Schema = defineAction({
  visibility: 'public',
  params: {
    resourceUri: 'string',
    file: 'object'
  },
  async handler(ctx) {
    const { resourceUri, file } = ctx.params;

    const fileName = getSlugFromUri(resourceUri);
    const containerPath = new URL(getContainerFromUri(resourceUri)).pathname;
    const dir = path.join(`./uploads${containerPath}`);
    const localPath = path.join(dir, fileName);
    if (!fs.existsSync(dir)) {
      process.umask(0);
      fs.mkdirSync(dir, { recursive: true, mode: 0o0777 });
    }

    try {
      await this.streamToFile(file.readableStream, localPath, this.settings.binary.maxSize);
    } catch (e) {
      if (e.code === 413) {
        throw e; // File too large
      } else {
        console.error(e);
        throw new MoleculerError(e, 500, 'Server Error');
      }
    }

    return {
      '@context': { '@vocab': 'http://semapps.org/ns/core#' },
      '@id': resourceUri,
      '@type': 'File',
      encoding: file.encoding,
      mimeType: file.mimetype,
      localPath,
      fileName
    };
  }
});

export default Schema;
