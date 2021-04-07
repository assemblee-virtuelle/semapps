---
title: Webfinger
---

This service implements the [WebFinger](https://en.wikipedia.org/wiki/WebFinger) protocol, which allows remote services to discover local users.

## Features

- Automatically find ActivityPub actors through their username
- Returns a 404 error if the actor doesn't exist

## Dependencies

- [ApiGateway](https://moleculer.services/docs/0.14/moleculer-web.html)
- ActivityPub [ActorService](activitypub.md)

## Install

```bash
$ npm install @semapps/webfinger --save
```

## Usage

```js
const { WebfingerService } = require('@semapps/webfinger');

module.exports = {
  mixins: [WebfingerService],
  settings: {
    baseUrl: "https://mydomain.com",
    domainName: "mydomain.com" // Not necessary if it is the same as usersContainer
  }
}
```

## Settings

| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `baseUrl` | `String` |  | Base URL of the server. Used to find the domain name if it is not set.
| `domainName` | `String` |  | Domain name used for the user@domain webfinger identifier. If not set, the domain name will be guessed from the users' container.


## Discovering an user with Webfinger

In the Webfinger protocol, users are identified by their username and the domain name where they are hosted: `username@domain`. This is similar to email addresses, except services like Mastodon add a `@` at the beginning.

To find an user, a simple GET is enough:

```
GET /.well-known/webfinger?resource=acct:simon@localhost HTTP/1.1
Host: localhost:3000
Accept: application/json
```

If the user exists locally, it will return a JSON like this:

```json
{
  "subject": "acct:simon@localhost",
  "aliases": [
    "http://localhost:3000/actors/simon"
  ],
  "links": [
    {
      "rel": "self",
      "type": "application/activity+json",
      "href": "http://localhost:3000/actors/simon"
    }
  ]
}
```

## Additional resources about the protocol

- https://docs.joinmastodon.org/spec/webfinger/
- https://www.packetizer.com/ws/webfinger/
- https://tools.ietf.org/html/rfc7033
