---
title: Connector
---

This service allows you to authentify users with an OIDC or CAS server.

## Features

- Handle OIDC and CAS servers in a single package
- Integrate easily with Moleculer's ApiGateway
- Handle local logout and remote logout

## Dependencies

- WebId

## Install

```bash
$ npm install @semapps/connector --save
```

## Generating JWT token

If you want to use the CAS connector, you first need to generate a public and private keys for the JWT token that will be automatically generated.

```bash
$ ssh-keygen -t rsa -b 4096 -m PEM -f jwtRS256.key -P ""
$ openssl rsa -in jwtRS256.key -pubout -outform PEM -out jwtRS256.key.pub
```

If you want to use the OIDC connector, you don't need to do that as we will use the token given by the remote server.

## Usage with an OIDC server

```js
const { ApiGatewayService } = require('moleculer-web');
const { OidcConnector } = require('@semapps/connector');

module.exports = {
  mixins: [ApiGatewayService],
  async started() {
    this.connector = new OidcConnector({
        issuer: "https://myissuer.com/auth/realms/master",
        clientId: "myClientId",
        clientSecret: "myClientSecret",
        publicKey: "-----BEGIN PUBLIC KEY-----...-----END PUBLIC KEY-----",
        redirectUri: 'http://localhost:3000/auth',
        selectProfileData: authData => ({
          email: authData.email,
          name: authData.given_name,
          familyName: authData.family_name
        }),
        findOrCreateProfile: async profileData => {
          // Or call activitypub.actor.create if you are creating ActivityPub actors directly
          return await this.broker.call('webid.create', profileData);
        }
      })

    await this.connector.initialize();

    // Add the /auth and /auth/logout routes
    this.addRoute(this.connector.getRoute());
  },
  methods: {
    authenticate(ctx, route, req, res) {
      return this.connector.authenticate(ctx, route, req, res);
    },
    authorize(ctx, route, req, res) {
      return this.connector.authorize(ctx, route, req, res);
    }
  }
}
```

## Usage with a CAS server

```js
const { ApiGatewayService } = require('moleculer-web');
const { CasConnector } = require('@semapps/connector');
const path = require('path')

module.exports = {
  mixins: [ApiGatewayService],
  async started() {
    this.connector = new CasConnector({
      casUrl: "https://my-cas-server.com/cas",
      privateKeyPath: path.resolve(__dirname, '../jwt/jwtRS256.key'),
      publicKeyPath: path.resolve(__dirname, '../jwt/jwtRS256.key.pub'),
      selectProfileData: authData => ({
        nick: authData.displayName,
        email: authData.mail[0],
        name: authData.field_first_name[0],
        familyName: authData.field_last_name[0]
      }),
      findOrCreateProfile: async profileData => {
        // Or call activitypub.actor.create if you are creating ActivityPub actors directly
        return await this.broker.call('webid.create', profileData);
      }
    });

    await this.connector.initialize();

    // Add the /auth and /auth/logout routes
    this.addRoute(this.connector.getRoute());
  },
  methods: {
    authenticate(ctx, route, req, res) {
      return this.connector.authenticate(ctx, route, req, res);
    },
    authorize(ctx, route, req, res) {
      return this.connector.authorize(ctx, route, req, res);
    }
  }
}
```

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

## Protecting routes

Please see the ApiGateway documentation about [authorization](https://moleculer.services/docs/0.14/moleculer-web.html#Authorization) and [authentication](https://moleculer.services/docs/0.14/moleculer-web.html#Authentication).
