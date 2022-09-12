---
title: Dataset
---

This service allows you to manage datasets in a Jena Fuseki instance, through its API.

## Features

- Create datasets, or check if they already exist
- Generate compressed backups og a given dataset
- Wait for a Fuseki task to be completed

## Actions

The following service actions are available:

### `exist`

Check if a dataset already exists.

##### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `dataset` | `String` | **required** | Name of the dataset |

##### Return
True if the dataset exists

### `list`

Return a list of all existing datasets in the Fuseki instance.

##### Return
An array with the names of all existing datasets.

### `create`

Create a dataset if it doesn't already exist.

##### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `dataset` | `String` | **required** | Name of the dataset |
| `secure` | `Boolean` | false | If true, Fuseki will check permissions with WebACL for this dataset. Only works with the [semapps/jena-fuseki-webacl](https://hub.docker.com/repository/docker/semapps/jena-fuseki-webacl) Docker image |

### `backup`

Generate a compressed backup of all the triples in the dataset (through [Fuseki protocol](https://jena.apache.org/documentation/fuseki2/fuseki-server-protocol.html)).

##### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `dataset` | `String` | **required** | Name of the dataset |

### `waitForCreation`

Wait for the dataset to have been created.

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
