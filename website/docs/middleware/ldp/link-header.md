---
title: LdpLinkHeaderService
---

This service is automatically created by the [LdpService](index.md) with the key `ldp.link-header`. It allows other services to add custom [Link header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Link) to GET and HEAD calls on LDP resources and containers.

## Actions

The following service actions are available:

### `get`

Get the Link header for the provided URI.

##### Parameters

| Property | Type     | Default      | Description                                    |
| -------- | -------- | ------------ | ---------------------------------------------- |
| `uri`    | `String` | **required** | URI of the resource or container being fetched |

##### Return values

A string with the whole Link header.

### `register`

Register a Moleculer action which will be called every time a HEAD or GET call is made.
This action will receive `uri` as a parameter, and must return an object containing at least an `uri` property, as well as any other parameter to be passed (for example `rel`).

##### Parameters

| Property     | Type     | Default      | Description                                    |
| ------------ | -------- | ------------ | ---------------------------------------------- |
| `actionName` | `String` | **required** | Full name of the Moleculer action to be called |
