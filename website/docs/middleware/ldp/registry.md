---
title: LdpRegistryService
---

This service is automatically created by the [LdpService](index.md) with the key `ldp.registry`. It keeps a registry of LDP containers and their associated options (which may be passed through the [ControlledContainerMixin](controlled-container.md)).

## Actions

The following service actions are available:

### `getByType`

Get the first container registration matching with the `acceptedTypes`.

##### Parameters

| Property  | Type                | Default      | Description                                             |
| --------- | ------------------- | ------------ | ------------------------------------------------------- |
| `type`    | `String` or `Array` | **required** | URI of container to which the resource will be attached |
| `dataset` | `String`            |              | If provided, will look in pod-specific containers       |

##### Return

A container registration

### `getByUri`

Get the first container registration matching with the resource or container URI.
If a resource URI is provided, it will get the first container containing this resource.

##### Parameters

| Property       | Type     | Default | Description                                       |
| -------------- | -------- | ------- | ------------------------------------------------- |
| `containerUri` | `String` |         | URI of the container                              |
| `resourceUri`  | `String` |         | URI of the resource                               |
| `dataset`      | `String` |         | If provided, will look in pod-specific containers |

##### Return

A container registration

### `getUri`

Get a container URI based on the container path and webId.

##### Parameters

| Property | Type     | Default      | Description                      |
| -------- | -------- | ------------ | -------------------------------- |
| `path`   | `String` | **required** | Container path                   |
| `webId`  | `String` |              | Required in Pod providers config |

### `list`

Get the list of container registrations

##### Parameters

| Property  | Type     | Default | Description                                      |
| --------- | -------- | ------- | ------------------------------------------------ |
| `dataset` | `String` |         | If provided, will return pod-specific containers |

##### Return

A object with the container registration name (or path) as key, and the container registration as value.

### `register`

Register a container.

##### Parameters

| Property        | Type                | Default | Description                                                                                                                            |
| --------------- | ------------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `path`          | `String`            |         | Path of the container. If not provided, will be generated with [`ldp.container.getPath`](container.md#getpath) and the `acceptedTypes` |
| `name`          | `String`            |         | Name of the container, used to store it (path will be used if none are provided)                                                       |
| `acceptedTypes` | `Array` or `String` |         | RDF classes accepted in this container                                                                                                 |
| `dataset`       | `String`            |         | If provided, will register the container only for the given dataset                                                                    |

For other available parameters, see the [container options](index.md#container-options).

##### Return

The container registration
