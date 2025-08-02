import { isMimeTypeMatching } from '@semapps/mime-types';
import { ServiceSchema } from 'moleculer';

import { Errors } from 'moleculer';

const { MoleculerError } = Errors;

const Schema = {
  settings: {
    mimeTypes: {
      accepted: [],
      rejected: []
    }
  },
  created() {
    const { mimeTypes } = this.settings;
    if (mimeTypes.accepted.length === 0 && mimeTypes.rejected.length === 0) {
      throw new Error(`The mimeTypes.accepted or mimeTypes.rejected setting is required for the MimeTypesMixin`);
    } else if (mimeTypes.accepted.length > 0 && mimeTypes.rejected.length > 0) {
      throw new Error(`You cannot set both mimeTypes.accepted and mimeType.rejected settings for the MimeTypesMixin`);
    }
  },
  hooks: {
    before: {
      async post(ctx) {
        const { file } = ctx.params;
        const { mimeTypes } = this.settings;

        if (
          (mimeTypes.accepted.length > 0 && !isMimeTypeMatching(file.mimetype, mimeTypes.accepted)) ||
          (mimeTypes.rejected.length > 0 && isMimeTypeMatching(file.mimetype, mimeTypes.rejected))
        ) {
          throw new MoleculerError(`Files of type ${file.mimetype} are not allowed`, 415, 'Unsupported Media Type');
        }
      }
    }
  }
} satisfies Partial<ServiceSchema>;

export default Schema;
