---
title: Backup
---

This service allows you to backup the triples in a given dataset, as well as the uploaded files.

## Features

- Backup Fuseki datasets and uploaded files
- Choose copy method: Rsync, FTP or filesystem (copy to another directory)
- Setup a cron to automatically launch the rsync operation

## Dependencies

- [TripleStoreService](triplestore)

## Install

```bash
$ yarn add @semapps/backup
```

If you wish to use the Rsync method, you will need to have `rsync`, `sshpass` and `openssh` installed on your server.

```bash
$ sudo apt-get install rsync sshpass openssh
```

You will also need to add the remote server domain as a known host, otherwise sshpass may fail:

```bash
ssh-keyscan REMOTE_SERVER_DOMAIN_NAME >> ~/.ssh/known_hosts
```

## Usage

```js
const BackupService = require('@semapps/backup');
const path = require('path');

module.exports = {
  mixins: [BackupService],
  settings: {
    localServer: {
      fusekiBase: '/absolute/path/to/fuseki-base/',
      otherDirsPaths: {
        uploads: path.resolve(__dirname, '../uploads')
      }
    },
    copyMethod: 'rsync', // Or 'ftp' or 'fs'
    remoteServer: {
      path: '/my-backups', // Required
      user: 'user', // Required for rsync and ftp
      password: 'password', // Required for rsync and ftp
      host: 'remote.server.com', // Required for rsync and ftp
      port: null // Required for ftp
    },
    // Required only if you want to do automatic backups
    cronJob: {
      time: '0 0 4 * * *', // Every night at 4am
      timeZone: 'Europe/Paris'
    }
  }
};
```

## Service settings

| Property                     | Type                     | Default | Description                                                                  |
| ---------------------------- | ------------------------ | ------- | ---------------------------------------------------------------------------- |
| `localServer.fusekiBase`     | `[String]`               |         | Absolute path to the Fuseki backups and other directories you want to backup |
| `localServer.otherDirsPaths` | `Record<string, string>` |         | Other directories to back up with the keys as the backup dir names.          |
| `copyMethod`                 | `[String]`               | "rsync" | Copy method ("rsync", "ftp" or "fs")                                         |
| `remoteServer`               | `[Object]`               |         | Information to connect to the remote server (see above)                      |
| `cronJob`                    | `[Object]`               |         | Information for the automatic backups (see above)                            |

## Actions

The following service actions are available:

### `backupAll`

Calls `backupDatasets` and `backupOtherDirs`.

### `backupDatasets`

Generate a compressed backup of all the existing datasets (through [Fuseki protocol](https://jena.apache.org/documentation/fuseki2/fuseki-server-protocol.html)), and rsync them with the remote server.

### `backupOtherDirs`

Copy the other directories defined in the settings with the remote server.

### `copyToRemoteServer`

Copy the data in the local server to the remote server.

##### Parameters

| Property | Type     | Default      | Description                                             |
| -------- | -------- | ------------ | ------------------------------------------------------- |
| `path`   | `String` | **required** | Absolute path to be synchronized with the remote server |
| `subDir` | `String` |              | Sub-directory in the remote server                      |
