---
title: Fuseki Admin
---

This service allows you to do various operations with a Jena Fuseki instance.

## Features

- Create datasets, or check if they already exist
- Generate backups and upload them to a remote server via rsync
- Setup a cron to automatically generate the backups

## Dependencies

- None

## Install

```bash
$ npm install @semapps/fuseki-admin --save
```

For the backup operations, you will also need to have `rsync` and `sshpass` installed on your server.

## Usage

```js
const { FusekiAdminService } = require('@semapps/fuseki-admin');

module.exports = {
  mixins: [FusekiAdminService],
  settings: {
    url: 'http://localhost:3030/',
    user: 'admin',
    password: 'admin',
    backups: {
      localServer: {
        path: '/absolute/path/to/fuseki/backups'
      },
      // Rsync
      remoteServer: {
        user: 'user',
        password: 'password',
        host: 'remote.server',
        path: '/my-backups'
      },
      // Required only if you want to do automatic backups
      cronJob: {
        time: '0 0 4 * * *', // Every night at 4am
        timeZone: 'Europe/Paris',
        dataset: 'localData'
      }
    }
  }
};
```

## Service settings

| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `url` | `String` | **required** | Base URL of the Fuseki instance |
| `user` | `String` | **required** | User with access to admin operations |
| `password` | `String` | **required** | Password for the above user |
| `backups`| `[Object]`|  | Informations required for dataset backups (see above) |


## Actions

The following service actions are available:

### `datasetExist`

Check if a dataset already exists.

##### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `dataset` | `String`  | **required** | Name of the dataset |

##### Return
True if the dataset exists

### `createDataset`

Create a dataset if it doesn't already exist.

##### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `dataset` | `String`  | **required** | Name of the dataset |

### `backupDataset`

Generate a compressed backup of all the triples in the dataset (through [Fuseki protocol](https://jena.apache.org/documentation/fuseki2/fuseki-server-protocol.html)), and upload them via rsync to the remote server defined in the settings.

##### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `dataset` | `String`  | **required** | Name of the dataset |
