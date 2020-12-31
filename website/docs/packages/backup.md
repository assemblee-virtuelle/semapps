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
$ npm install @semapps/backup --save
```

You will need to have `rsync` and `sshpass` installed on your server.

```bash
$ sudo apt-get install rsync sshpass
```

You will also need to add the remote server domain as a known host, otherwise sshpass may fail:

```bash
ssh-keyscan REMOTE_SERVER_DOMAIN_NAME >> ~/.ssh/known_hosts
```

## Usage

```js
const { BackupService } = require('@semapps/backup');
const path = require('path');

module.exports = {
  mixins: [BackupService],
  settings: {
    localServer: {
      fusekiBackupsPath: '/absolute/path/to/fuseki/backups',
      uploadsPath: path.resolve(__dirname, '../uploads')
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
      timeZone: 'Europe/Paris',
      dataset: 'localData'
    }
  }
};
```

## Service settings

| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `localServer`| `[Object]`|  | Absolute path to the Fuseki backups and uploads directories |
| `remoteServer`| `[Object]`|  | Informations to connect to the remote server (see above) |
| `cronJob`| `[Object]`|  | Informations for the automatic backups (see above) |


## Actions

The following service actions are available:

### `backupDataset`

Generate a backup of the given dataset, and rsync it with the remote server.

##### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `dataset` | `String`  | **required** | Name of the dataset |

### `backupUploads`

Rsync the uploaded files directory with the remote server.

### `syncWithRemoteServer`

Generate a compressed backup of all the triples in the dataset (through [Fuseki protocol](https://jena.apache.org/documentation/fuseki2/fuseki-server-protocol.html)), and upload them via rsync to the remote server defined in the settings.

##### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `path` | `String`  | **required** | Absolute path to be synchronized with the remote server |
| `subDir` | `String`  | | Sub-directory in the remote server |
