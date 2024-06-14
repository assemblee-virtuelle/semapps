const Client = require('ssh2-sftp-client');
const { join: pathJoin } = require('path');

const ftpRemove = (removeFiles, remoteServer) => {
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
        resolve();
      })
      .catch(e => reject(e));
  });
};

module.exports = ftpRemove;
