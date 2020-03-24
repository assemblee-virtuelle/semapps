[![SemApps](https://badgen.net/badge/Powered%20by/SemApps/28CDFB)](https://semapps.org)

# {{projectName}}
This is a [SemApps](https://semapps.org/)-based semantic application

## Quick start

{{#localFuseki}}
#### Launch your local Jena Fuseki instance

Jena Fuseki is a semantic triple store. It is where your app's data will be stored.

You need [docker](https://docs.docker.com/install/) and [docker-compose](https://docs.docker.com/compose/install/) installed on your machine.

```bash
$ docker-compose up
```

Jena Fuseki is now available at the URL http://localhost:3030
{{/localFuseki}}

#### Run Moleculer in dev mode

```bash
$ npm run dev
```

Your instance of SemApps is available at http://localhost:3030

## Useful links

* SemApps website: https://semapps.org/
* SemApps github: https://github.com/assemblee-virtuelle/semapps

## NPM scripts

- `npm run dev`: Start development mode (with hot-reload & REPL)
- `npm run start`: Start production mode
