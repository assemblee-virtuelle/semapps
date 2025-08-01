const { MoleculerError } = require('moleculer').Errors;

/**
 * Calls "has" action and throws error if no authorization was granted
 */
const Schema = {
  visibility: 'public',
  params: {
    uri: { type: 'string' },
    type: { type: 'enum', values: ['resource', 'container', 'custom'], default: 'resource' },
    mode: { type: 'enum', values: ['acl:Read', 'acl:Write', 'acl:Append', 'acl:Control'], default: 'acl:Read' },
    webId: { type: 'string', optional: true }
  },
  async handler(ctx) {
    if (!(await this.actions.has(ctx.params, { parentCtx: ctx }))) {
      throw new MoleculerError('Forbidden', 403, 'ACCESS_DENIED');
    }
  }
};

export default Schema;
