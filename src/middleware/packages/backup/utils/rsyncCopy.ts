// @ts-expect-error TS(7016): Could not find a declaration file for module 'rsyn... Remove this comment to see the full error message
import Rsync from 'rsync';
// @ts-expect-error TS(2305): Module '"path"' has no exported member 'pathJoin'.
import { pathJoin as join } from 'path';

const rsyncCopy = (path: any, subDir: any, remoteServer: any, syncDelete = false) => {
  // Setup rsync to remote server
  const rsync = new Rsync()
    .flags('arv')
    .set('e', `sshpass -p "${remoteServer.password}" ssh -o StrictHostKeyChecking=no`)
    .source(path)
    // @ts-expect-error TS(2304): Cannot find name 'pathJoin'.
    .destination(`${remoteServer.user}@${remoteServer.host}:${pathJoin(remoteServer.path, subDir)}`);

  if (syncDelete) rsync.set('delete');

  return new Promise((resolve, reject) => {
    console.log(`Rsync started with command: ${rsync.command()}`);
    rsync.execute((error: any) => {
      if (error) {
        reject(error);
      } else {
        console.log('Rsync finished !');
        // @ts-expect-error TS(2794): Expected 1 arguments, but got 0. Did you forget to... Remove this comment to see the full error message
        resolve();
      }
    });
  });
};

export default rsyncCopy;
