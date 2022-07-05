---
title: Fuseki Admin
---

This service allows you to do various operations with a Jena Fuseki instance, by calling its API.

## Features

- Create datasets, or check if they already exist
- Generate compressed backups og a given dataset
- Wait for a Fuseki task to be completed

## Dependencies

- None

## Install

```bash
$ yarn add @semapps/fuseki-admin
```

## Usage

```js
const { FusekiAdminService } = require('@semapps/fuseki-admin');

module.exports = {
  mixins: [FusekiAdminService],
  settings: {
    url: 'http://localhost:3030/',
    user: 'admin',
    password: 'admin'
  }
};
```

## Service settings

| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `url` | `String` | **required** | Base URL of the Fuseki instance |
| `user` | `String` | **required** | User with access to admin operations |
| `password` | `String` | **required** | Password for the above user |


## Actions

The following service actions are available:

### `datasetExist`

Check if a dataset already exists.

##### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `dataset` | `String` | **required** | Name of the dataset |

##### Return
True if the dataset exists

### `listAllDatasets`

Return a list of all existing datasets in the Fuseki instance.

##### Return
An array with the names of all existing datasets.

### `createDataset`

Create a dataset if it doesn't already exist.

##### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `dataset` | `String` | **required** | Name of the dataset |
| `secure` | `Boolean` | false | If true, Fuseki will check permissions with WebACL for this dataset. Only works with the [semapps/jena-fuseki-webacl](https://hub.docker.com/repository/docker/semapps/jena-fuseki-webacl) Docker image |

### `backupDataset`

Generate a compressed backup of all the triples in the dataset (through [Fuseki protocol](https://jena.apache.org/documentation/fuseki2/fuseki-server-protocol.html)).

##### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `dataset` | `String` | **required** | Name of the dataset |

### `waitForTaskCompletion`

Wait for a Fuseki task to be completed.

##### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `taskId` | `String` | **required** | ID of the Fuseki task |
