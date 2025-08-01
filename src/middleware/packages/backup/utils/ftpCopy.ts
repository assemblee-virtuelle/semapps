import fs from 'fs';
import Client from 'ssh2-sftp-client';
import { join as pathJoin } from 'path';

const ftpCopy = (path, subDir, remoteServer) => {
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
            const newFiles = files.filter(f => now - fs.statSync(`${path}/${f}`).mtime < 60000);
            for (const filename of newFiles) {
              await sftp.put(pathJoin(path, filename), pathJoin(remoteServer.path, filename));
            }
            resolve();
          }
        });
      })
      .catch(e => reject(e));
  });
};

export default ftpCopy;
