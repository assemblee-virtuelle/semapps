const os = require('os');

module.exports = {
  nodeID: process.argv[2] || os.hostname() + '-server',
  logger: console
};
