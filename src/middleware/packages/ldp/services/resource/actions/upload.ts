import path from 'path';
import fs from 'fs';
import { ActionSchema } from 'moleculer';
import { getSlugFromUri, getContainerFromUri } from '../../../utils.ts';

<<<<<<< HEAD
const { MoleculerError } = require('moleculer').Errors;
=======
import { Errors } from 'moleculer';

const { MoleculerError } = Errors;
>>>>>>> 2.0

const Schema = {
  visibility: 'public',
  params: {
    // @ts-expect-error TS(2322): Type 'string' is not assignable to type 'Parameter... Remove this comment to see the full error message
    resourceUri: 'string',
    // @ts-expect-error TS(2322): Type 'string' is not assignable to type 'Parameter... Remove this comment to see the full error message
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
      // @ts-expect-error TS(2723): Cannot invoke an object which is possibly 'null' o... Remove this comment to see the full error message
      await this.streamToFile(file.readableStream, localPath, this.settings.binary.maxSize);
    } catch (e) {
      // @ts-expect-error TS(18046): 'e' is of type 'unknown'.
      if (e.code === 413) {
        throw e; // File too large
      } else {
        console.error(e);
        // @ts-expect-error TS(2345): Argument of type 'unknown' is not assignable to pa... Remove this comment to see the full error message
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
} satisfies ActionSchema;

export default Schema;
