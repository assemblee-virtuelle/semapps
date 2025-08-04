import fs from 'fs-extra';
import { join as pathJoin } from 'path';

const fsCopy = async (path, subDir, remoteServer) => {
  const destDir = pathJoin(remoteServer.path, subDir);
  await fs.copy(path, destDir);
};

export default fsCopy;
