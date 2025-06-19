import fs from 'fs';
// @ts-expect-error TS(2305): Module '"path"' has no exported member 'pathJoin'.
import { pathJoin as join } from 'path';

const fsRemove = async (removeFiles: any, subDir: any, remoteServer: any) => {
  await Promise.all(
    removeFiles
      // @ts-expect-error TS(2304): Cannot find name 'pathJoin'.
      .map((file: any) => pathJoin(remoteServer.path, subDir, file))
      .map((file: any) => fs.promises.rm(file, { force: true }))
  );
};

export default fsRemove;
