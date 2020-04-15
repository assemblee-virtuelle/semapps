---
title: Connector
---

This service allows you to authentify users with an OIDC or CAS server.

## Features

- Handle OIDC and CAS connections in a single package

## Dependencies

- None

## Install

```bash
$ npm install @semapps/connector --save
```

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

First you need to generate a public and private keys for the JWT token that will be automatically generated.

```bash
$ ssh-keygen -t rsa -b 4096 -m PEM -f jwtRS256.key -P ""
$ openssl rsa -in jwtRS256.key -pubout -outform PEM -out jwtRS256.key.pub
```

Then you can setup your connector like this:

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
      findOrCreateProfile
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

