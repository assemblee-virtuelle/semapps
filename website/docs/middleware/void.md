---
title: VoID
---

This service implements the [VoID](https://www.w3.org/TR/void/) protocol, which allows to publish metadata about a dataset.

## Features

- Deploys an endpoint on the `/.well-known/void` path
- Automatically find the containers from the LDP service
- Also find the number of resources, and the blank nodes

## Dependencies

- [ApiGateway](https://moleculer.services/docs/0.14/moleculer-web.html)
- [LdpService](ldp)

## Install

```bash
$ yarn add @semapps/void
```

## Usage

```js
const { VoidService } = require('@semapps/void');

module.exports = {
  mixins: [VoidService],
  settings: {
    baseUrl: 'http://localhost:3000/',
    ontologies : [
      {
        prefix: 'rdf',
        url: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#'
      },
      {
        prefix: 'ldp',
        url: 'http://www.w3.org/ns/ldp#',
      }
    ],
    title: "My instance",
    description: "Description of my instance"
  }
};
```

## Settings

| Property      | Type     | Default      | Description                                                           |
|---------------|----------|--------------|-----------------------------------------------------------------------|
| `baseUrl`     | `String` | **required** | Base URL of the server                                                |            
| `ontologies`  | `Array`  | **required** | List of ontology used (same format as LdpService)                     |
| `title`       | `String` |              | Title of your instance. Will be displayed in the VOID endpoint.       |
| `description` | `String` |              | Short description of your instance. Also display in the VOID endpoint |
