---
title: Backup
---

This service allows you to backup the triples in a given dataset, as well as the uploaded files.

## Features

- Rsync Fuseki datasets backups with a remote server
- Rsync uploaded files with a remote server
- Setup a cron to automatically launch the rsync operation

## Dependencies

- [FusekiAdminService](fuseki-admin.md)

## Install

```bash
$ yarn add @semapps/backup
```

You will need to have `rsync`, `sshpass` and `openssh` installed on your server.

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
      fusekiBackupsPath: '/absolute/path/to/fuseki/backups',
      otherDirsPaths: {
        uploads: path.resolve(__dirname, '../uploads')
      }
    },
    // Rsync
    remoteServer: {
      user: 'user',
      password: 'password',
      host: 'remote.server.com',
      path: '/my-backups'
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

| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `localServer`| `[Object]`|  | Absolute path to the Fuseki backups and other directories you want to backup |
| `remoteServer`| `[Object]`|  | Informations to connect to the remote server (see above) |
| `cronJob`| `[Object]`|  | Informations for the automatic backups (see above) |

## Actions

The following service actions are available:

### `backupAll`

Calls `backupDatasets` and `backupOtherDirs`.

### `backupDatasets`

Generate a compressed backup of all the existing datasets (through [Fuseki protocol](https://jena.apache.org/documentation/fuseki2/fuseki-server-protocol.html)), and rsync them with the remote server.

### `backupOtherDirs`

Rsync the other directories defined in the settings with the remote server.

### `syncWithRemoteServer`

Rsync the given path in the local server with the remote server.

##### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `path` | `String`  | **required** | Absolute path to be synchronized with the remote server |
| `subDir` | `String`  | | Sub-directory in the remote server |
