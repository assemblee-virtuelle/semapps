const fs = require('fs-extra');
const { join: pathJoin } = require('path');

const fsCopy = async (path, subDir, remoteServer) => {
  const destDir = pathJoin(remoteServer.path, subDir);
  await fs.copy(path, destDir);
};

module.exports = fsCopy;
