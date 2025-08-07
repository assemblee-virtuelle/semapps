// @ts-expect-error TS(7016): Could not find a declaration file for module 'ssh2... Remove this comment to see the full error message
import Client from 'ssh2-sftp-client';
import { join as pathJoin } from 'path';

const ftpRemove = (removeFiles: any, remoteServer: any) => {
  return new Promise((resolve, reject) => {
    const sftp = new Client();
    sftp
      .connect({
        host: remoteServer.host,
        port: remoteServer.port,
        username: remoteServer.user,
        password: remoteServer.password
      })
      .then(async () => {
        for (const filename of removeFiles) {
          await sftp.delete(pathJoin(remoteServer.path, filename), true);
        }
        // @ts-expect-error TS(2794): Expected 1 arguments, but got 0. Did you forget to... Remove this comment to see the full error message
        resolve();
      })
      .catch((e: any) => reject(e));
  });
};

export default ftpRemove;
