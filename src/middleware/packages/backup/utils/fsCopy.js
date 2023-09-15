const fs = require('fs-extra');
const { join: pathJoin } = require('path');

const fsCopy = async (path, subDir, remoteServer) => {
  const destDir = pathJoin(remoteServer.path, subDir);
  console.log(`Copying to ${destDir}`);
  await fs.copy(path, destDir);
  console.log('Copy finished !');
};

module.exports = fsCopy;
