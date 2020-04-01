module.exports = {
  visibility: 'public',
  async handler(ctx) {
    let aliases = {};

    this.settings.containers.forEach(containerPath => {
      const containerUri = this.settings.baseUrl + containerPath;
      aliases['GET ' + containerPath] = async (req, res) => {
        const result = await this.actions.get({ containerUri, accept: req.headers.accept });
        res.write(JSON.stringify(result));
        res.end();
      };
    });

    return {
      authorization: false,
      authentication: true,
      aliases
    };
  }
};
