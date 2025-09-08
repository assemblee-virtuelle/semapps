import { isMimeTypeMatching } from '@semapps/mime-types';
import { ServiceSchema } from 'moleculer';

const { MoleculerError } = require('moleculer').Errors;

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
        // @ts-expect-error TS(2339): Property 'mimeTypes' does not exist on type 'strin... Remove this comment to see the full error message
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
