const path = require('path');
const fs = require('fs');
const { getSlugFromUri, getContainerFromUri } = require('../../../utils');
const { MoleculerError } = require('moleculer').Errors;

module.exports = {
  visibility: 'public',
  params: {
    resourceUri: 'string',
    file: 'object'
  },
  async handler(ctx) {
    let { resourceUri, file } = ctx.params;

    const fileName = getSlugFromUri(resourceUri);
    const containerPath = new URL(getContainerFromUri(resourceUri)).pathname;
    const dir = path.join('./uploads' + containerPath);
    const localPath = path.join(dir, fileName);
    if (!fs.existsSync(dir)) {
      process.umask(0);
      fs.mkdirSync(dir, { recursive: true, mode: parseInt('0777', 8) });
    }

    try {
      await this.streamToFile(file.readableStream, localPath);
    } catch (e) {
      throw new MoleculerError(e, 500, 'Server Error');
    }

    return {
      '@context': { '@vocab': 'http://semapps.org/ns/core#' },
      '@id': resourceUri,
      '@type': 'semapps:File',
      encoding: file.encoding,
      mimeType: file.mimetype,
      localPath,
      fileName
    };
  }
};
