import fs from 'fs';
// @ts-expect-error TS(7016): Could not find a declaration file for module 'ssh2... Remove this comment to see the full error message
import Client from 'ssh2-sftp-client';
import { join as pathJoin } from 'path';

const ftpCopy = (path: any, subDir: any, remoteServer: any) => {
  return new Promise((resolve, reject) => {
    const sftp = new Client();
    sftp
      .connect({
        host: remoteServer.host,
        port: remoteServer.port,
        username: remoteServer.user,
        password: remoteServer.password
      })
      .then(() => {
        fs.readdir(path, async (err, files) => {
          if (err) {
            reject(`Unable to scan directory: ${err.message}`);
          } else {
            const now = Date.now();
            // @ts-expect-error TS(2363): The right-hand side of an arithmetic operation mus... Remove this comment to see the full error message
            const newFiles = files.filter(f => now - fs.statSync(`${path}/${f}`).mtime < 60000);
            for (const filename of newFiles) {
              await sftp.put(pathJoin(path, filename), pathJoin(remoteServer.path, filename));
            }
            // @ts-expect-error TS(2794): Expected 1 arguments, but got 0. Did you forget to... Remove this comment to see the full error message
            resolve();
          }
        });
      })
      .catch((e: any) => reject(e));
  });
};

export default ftpCopy;
