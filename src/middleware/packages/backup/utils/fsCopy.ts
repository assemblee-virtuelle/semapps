// @ts-expect-error TS(7016): Could not find a declaration file for module 'fs-e... Remove this comment to see the full error message
import fs from 'fs-extra';
// @ts-expect-error TS(2305): Module '"path"' has no exported member 'pathJoin'.
import { join as pathJoin } from 'path';

const fsCopy = async (path: any, subDir: any, remoteServer: any) => {
  const destDir = pathJoin(remoteServer.path, subDir);
  await fs.copy(path, destDir);
};

export default fsCopy;
