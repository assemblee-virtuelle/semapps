import fs from 'fs-extra';
import { pathJoin as join } from 'path';

const fsCopy = async (path, subDir, remoteServer) => {
  const destDir = pathJoin(remoteServer.path, subDir);
  await fs.copy(path, destDir);
};

export default fsCopy;
