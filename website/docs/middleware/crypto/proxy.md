---
title: ProxyService
---

Proxy endpoint which signs requests with HTTP signatures

## Features

- Allow to pass custom headers
- Handle all HTTP methods, including uploads

## Dependencies

- [ApiGateway](https://moleculer.services/docs/0.14/moleculer-web.html)

## Settings

| Property      | Type      | Default | Description                                                 |
| ------------- | --------- | ------- | ----------------------------------------------------------- |
| `podProvider` | `Boolean` | false   | If true, the service will setup one proxy endpoint per POD. |

## Actions

The following service actions are available.

### `query`

Make a request to a remote server through the proxy.
The remote server must handle HTTP signature for this to work.

##### Parameters

| Property   | Type                 | Default      | Description                                                   |
| ---------- | -------------------- | ------------ | ------------------------------------------------------------- |
| `url`      | `String`             | **required** | URL of the resource to fetch                                  |
| `method`   | `String`             | "GET"        | Method to use                                                 |
| `headers`  | `Object`             |              | Key values to be passed as headers                            |
| `body`     | `String` or `Stream` |              | Body of the request (can be a string or a stream for uploads) |
| `actorUri` | `String`             |              | Actor URI which is sending the request                        |
