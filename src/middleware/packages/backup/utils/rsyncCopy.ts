import Rsync from 'rsync';
import { pathJoin as join } from 'path';

const rsyncCopy = (path, subDir, remoteServer, syncDelete = false) => {
  // Setup rsync to remote server
  const rsync = new Rsync()
    .flags('arv')
    .set('e', `sshpass -p "${remoteServer.password}" ssh -o StrictHostKeyChecking=no`)
    .source(path)
    .destination(`${remoteServer.user}@${remoteServer.host}:${pathJoin(remoteServer.path, subDir)}`);

  if (syncDelete) rsync.set('delete');

  return new Promise((resolve, reject) => {
    console.log(`Rsync started with command: ${rsync.command()}`);
    rsync.execute(error => {
      if (error) {
        reject(error);
      } else {
        console.log('Rsync finished !');
        resolve();
      }
    });
  });
};

export default rsyncCopy;
