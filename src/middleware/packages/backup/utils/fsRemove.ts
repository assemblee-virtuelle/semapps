import fs from 'fs';
import { join as pathJoin } from 'path';

const fsRemove = async (removeFiles, subDir, remoteServer) => {
  await Promise.all(
    removeFiles
      .map(file => pathJoin(remoteServer.path, subDir, file))
      .map(file => fs.promises.rm(file, { force: true }))
  );
};

export default fsRemove;
