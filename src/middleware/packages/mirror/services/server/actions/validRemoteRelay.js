module.exports = {
  visibility: 'public',
    params: {
    actor: { type: 'string', optional: false }
  },
  async handler(ctx) {
    // check that the sending actor is in our list of mirroredServers (security: if not it is some spamming or malicious attempt)
    if (!this.mirroredServers.includes(ctx.params.actor)) {
      this.logger.warn('SECURITY ALERT : received announce from actor we are not following : ' + ctx.params.actor);
      return false;
    }
    return true;
  }
};
