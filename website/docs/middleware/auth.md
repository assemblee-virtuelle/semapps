---
title: Auth
---

This service allows you to authenticate users with an OIDC or CAS server, or with a local account.

## Features

- Handle OIDC, CAS or local authentication in a single package
- Integrate easily with Moleculer's ApiGateway

## Dependencies

- [ApiGateway](https://moleculer.services/docs/0.14/moleculer-web.html)
- [WebIdService](webid.md)

## Sub-services

- AuthAccountService
- AuthJWTService
- AuthMailService

## Install

```bash
$ yarn add @semapps/auth
```

## Usage

### Local accounts

```js
const { AuthLocalService } = require('@semapps/auth');
const path = require('path');

module.exports = {
  mixins: [AuthLocalService],
  settings: {
    baseUrl: 'http://localhost:3000',
    // Path where the JWT keypair will be saved
    jwtPath: path.resolve(__dirname, '../jwt'),
    // Usernames you don't want users to signup with
    reservedUsernames: [],
    // User data you want to be available in the webId
    webIdSelection: [],
    // If false, user account must be created manually with a foaf:email field. True by default.
    registrationAllowed: true,
    // Dataset where the account data will be stored (email, hashed password...)
    accountsDataset: 'settings',
    // If true, a capabilities service is created and capabilities auth is enabled
    podProvider: false
  }
};
```

### OIDC

```js
const { AuthOIDCService } = require('@semapps/auth');
const path = require('path');

module.exports = {
  mixins: [AuthOIDCService],
  settings: {
    // See above for the descriptions
    baseUrl: 'http://localhost:3000',
    jwtPath: path.resolve(__dirname, '../jwt'),
    reservedUsernames: [],
    webIdSelection: [],
    registrationAllowed: true,
    // OIDC-specific settings
    issuer: 'https://myissuer.com/auth/realms/master',
    clientId: 'myClientId',
    clientSecret: 'myClientSecret',
    // Return data for the creation of the webId profile (FOAF Person).
    // Available fields: uuid, nick, name, familyName, email, homepage
    selectSsoData: authData => ({
      email: authData.email,
      name: authData.given_name,
      familyName: authData.family_name
    }),
    // Dataset where the account data will be stored (email)
    accountsDataset: 'settings',
    // If true, a capabilities service is created and capabilities auth is enabled
    podProvider: false
  }
};
```

### CAS

```js
const { AuthCasService } = require('@semapps/auth');
const path = require('path');

module.exports = {
  mixins: [AuthCasService],
  settings: {
    // See above for the descriptions
    baseUrl: 'http://localhost:3000',
    jwtPath: path.resolve(__dirname, '../jwt'),
    reservedUsernames: [],
    webIdSelection: [],
    registrationAllowed: true,
    // CAS-specific settings
    casUrl: 'https://my-cas-server.com/cas',
    // Return data for the creation of the webId profile (FOAF Person).
    // Available fields: uuid, nick, name, familyName, email, homepage
    selectSsoData: authData => ({
      email: authData.email,
      name: authData.given_name,
      familyName: authData.family_name
    }),
    // Dataset where the account data will be stored (email)
    accountsDataset: 'settings',
    // If true, a capabilities service is created and capabilities auth is enabled
    podProvider: false
  }
};
```

## API routes protection

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
};
```

For more information, please see the official Moleculer documentation about [authorization](https://moleculer.services/docs/0.14/moleculer-web.html#Authorization) and [authentication](https://moleculer.services/docs/0.14/moleculer-web.html#Authentication).

You can enable **authorization of routes based on capabilities**. For more details, see the documentation on [Verifiable Credentials](./crypto/verifiable-credentials.md#setting-up-capability-enabled-routes)

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

| Property | Type     | Default      | Description                    |
| -------- | -------- | ------------ | ------------------------------ |
| `webId`  | `String` | **required** | URI of the user to impersonate |

##### Return

A JWT token you can use in your app.

## Events

### `auth.registered`

Sent when a new user registers.

##### Payload

| Property      | Type     | Description     |
| ------------- | -------- | --------------- |
| `webId`       | `String` | URI of the user |
| `profileData` | `Object` | User's data     |

### `auth.connected`

Sent when an user logins.

##### Payload

| Property | Type     | Description     |
| -------- | -------- | --------------- |
| `webId`  | `String` | URI of the user |
