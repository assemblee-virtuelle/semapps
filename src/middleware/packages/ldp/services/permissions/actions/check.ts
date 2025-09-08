import { ActionSchema } from 'moleculer';

const { MoleculerError } = require('moleculer').Errors;

/**
 * Calls "has" action and throws error if no authorization was granted
 */
const Schema = {
  visibility: 'public',
  params: {
    uri: { type: 'string' },
    // @ts-expect-error TS(2353): Object literal may only specify known properties, ... Remove this comment to see the full error message
    type: { type: 'enum', values: ['resource', 'container', 'custom'], default: 'resource' },
    // @ts-expect-error TS(2353): Object literal may only specify known properties, ... Remove this comment to see the full error message
    mode: { type: 'enum', values: ['acl:Read', 'acl:Write', 'acl:Append', 'acl:Control'], default: 'acl:Read' },
    webId: { type: 'string', optional: true }
  },
  async handler(ctx) {
    // @ts-expect-error TS(2533): Object is possibly 'null' or 'undefined'.
    if (!(await this.actions.has(ctx.params, { parentCtx: ctx }))) {
      throw new MoleculerError('Forbidden', 403, 'ACCESS_DENIED');
    }
  }
} satisfies ActionSchema;

export default Schema;
