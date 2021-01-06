---
title:  init & configure your project in minimal stack
---


## Purpose

initialize and configure your semapps application without docker

## Prerequisites

- [NodeJS](https://nodejs.org/en/)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- you can une [nvm](https://github.com/nvm-sh/nvm) to manage NodeJs and npm version
- [git](https://fr.wikipedia.org/wiki/Git)

## create semantic data base, server and interfaces
clone a git repo or make a directory and open it.
to install the server, refer to https://semapps.org/docs/guides/ldp-server
```bash
npm install -g moleculer-cli # install moleculer client to use moleculer template
moleculer init assemblee-virtuelle/semapps-template-ldp server #init a moleculer server thanks to template
```
### fuseky ever installed or manual fuseky installation
#### fuseky manual installation
if you ever have fuseky instance, you can plug semapps server on.
if you don't have fuseki server but you want install it without docker, we recommand to install it before semapps server :
[fuseki documentation](https://jena.apache.org/documentation/fuseki2/).
#### install semapps middleware / server
```bash
? Do you need a local instance of Jena Fuseki (with Docker)? No
? What is the URL of your Jena Fuseki instance? <url of your fuseky instance>
? What is the name of the dataset ? <name of main dataset of your fuseky instance>
```
environment variables are written in .env file and you can change connection to fuseki server.

### fuseky not ever installed but docker-compose installed
you don't have fuseky server and you want to install it and you have docker-compose ever installed and you are ok to use docker-compose to run fuseki.
```bash
? Do you need a local instance of Jena Fuseki (with Docker)? Yes
```
```bash
cd server
docker-compose up #start fuseki + jenna
```
## run semapps middleware / server
```bash
cd server
npm run dev
```
## configure your application
You can configure [server](./init_main#server-configuration) and [interface](./init_main#interface-configuration) to implement your needs. You could change [environment](./init_main#environnement-configuration).
