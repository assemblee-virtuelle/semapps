import fs from 'fs';
import { join as pathJoin } from 'path';

const fsRemove = async (removeFiles: any, subDir: any, remoteServer: any) => {
  await Promise.all(
    removeFiles
      .map((file: any) => pathJoin(remoteServer.path, subDir, file))
      .map((file: any) => fs.promises.rm(file, { force: true }))
  );
};

export default fsRemove;
