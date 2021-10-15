---
title: Auth
---

This service allows you to authenticate users with an OIDC or CAS server.

## Features

- Handle OIDC and CAS servers in a single package
- Integrate easily with Moleculer's ApiGateway
- Handle local logout and remote logout

## Dependencies

- [ApiGateway](https://moleculer.services/docs/0.14/moleculer-web.html)
- [WebIdService](webid.md)

## Install

```bash
$ npm install @semapps/auth --save
```

## Usage

```js
const { AuthService } = require('@semapps/auth');
const path = require('path');

module.exports = {
  mixins: [AuthService],
  settings: {
    baseUrl: "http://localhost:3000",
    jwtPath: path.resolve(__dirname, '../jwt'),
    // To set if you want to use an OIDC server
    oidc: {
      issuer: "https://myissuer.com/auth/realms/master",
      clientId: "myClientId",
      clientSecret: "myClientSecret",
    },
    // To set if you want to use a CAS server
    cas: {
      url: "https://my-cas-server.com/cas",
    },
    // Return data for the creation of the webId profile (FOAF Person).
    // Available fields: email (required), name, familyName, nick, homepage
    selectProfileData: authData => ({
      email: authData.email,
      name: authData.given_name,
      familyName: authData.family_name
    }),
    // If false, user account must be created manually with a foaf:email field. True by default.
    registrationAllowed: true
  }
};
```

To protect the different routes, you will need to configure the `authenticate` and `authorize` methods of the ApiGatewayService to call AuthService's respective actions.

```js
const { ApiGatewayService } = require('moleculer-web');

module.exports = {
  mixins: [ApiGatewayService],
  methods: {
    authenticate(ctx, route, req, res) {
      return ctx.call('auth.authenticate', { route, req, res });
    },
    authorize(ctx, route, req, res) {
      return ctx.call('auth.authorize', { route, req, res });
    }
  }
}
```

For more information, please see the official Moleculer documentation about [authorization](https://moleculer.services/docs/0.14/moleculer-web.html#Authorization) and [authentication](https://moleculer.services/docs/0.14/moleculer-web.html#Authentication).

> It is important that you do not put the AuthService as a dependency of the ApiGatewayService, because the ApiGatewayService is a dependency of AuthService, and you will get a circular dependencies loop.

## Client login

From the frontend, redirect the user to this URL:

http://localhost:3000/auth/?redirectUrl=...

After login, the user will be redirected to the provided `redirectUrl`, and to this URL will be added the JWT token as a query string. You should store it and remove it like this:

```js
  const url = new URL(window.location);
  if (url.searchParams.has('token')) {
    localStorage.setItem('token', url.searchParams.get('token'));
    url.searchParams.delete('token');
    window.location.href = url.toString();
  }
```

## Client logout

From the frontend, redirect the user to this URL:

http://localhost:3000/auth/logout?redirectUrl=...

If you wish to logout the user remotely (on the SSO), you can do:

http://localhost:3000/auth/logout?global=true&redirectUrl...

## Actions 

The following service actions are available:

### `impersonate`

Generate a JWT token for a given user.

##### Parameters
| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `webId` | `String`| **required** | URI of the user to impersonate |

##### Return
A JWT token you can use in your app.

## Events

### `auth.registered`

Sent when a new user registers.

##### Parameters
| Property | Type | Description |
| -------- | ---- | ----------- |
| `webId` | `String` | URI of the user |
| `profileData` | `Object` | Data of the user's webId profile |
| `authData` | `Object` | Data returned by the OIDC or CAS provider |

### `auth.connected`

Sent when an user connects.

##### Parameters
| Property | Type | Description |
| -------- | ---- | ----------- |
| `webId` | `String` | URI of the user |
| `profileData` | `Object` | Data of the user's webId profile |
| `authData` | `Object` | Data returned by the OIDC or CAS provider |
