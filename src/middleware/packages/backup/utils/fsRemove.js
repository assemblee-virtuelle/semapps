const fs = require('fs');
const { join: pathJoin } = require('path');

const fsRemove = async (removeFiles, subDir, remoteServer) => {
  await Promise.all(
    removeFiles
      .map(file => pathJoin(remoteServer.path, subDir, file))
      .map(file => fs.promises.rm(file, { force: true }))
  );
};

module.exports = fsRemove;
