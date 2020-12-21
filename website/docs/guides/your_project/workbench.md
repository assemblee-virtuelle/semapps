---
title:  semapps workbench
---


## Purpose

initialize, configure and deploy your semapps application in 5 minutes.

## Prerequisites

- [docker-compose](https://docs.docker.com/compose/) & [docker](https://docs.docker.com/engine/)
- [NodeJS](https://nodejs.org/en/)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- you can une [nvm](https://github.com/nvm-sh/nvm) to manage NodeJs and npm version
- [make](https://fr.wikipedia.org/wiki/Make)
- [git](https://fr.wikipedia.org/wiki/Git)

## Go
there is a way to launch a project very quickly : [semapps-workbench](https://github.com/assemblee-virtuelle/semapps-workbench)
It is only a tool that simplifies the different manipulations that will be seen in this guide.

## init a project
* fork [semapps-workbench](https://github.com/assemblee-virtuelle/semapps-workbench) git repository : this is your directory for your project
* clone new repository on your local environment
* initialise & server server + initialise an DMS/archipelago client + set up containers infrastructure
```bash
make init
```
## start a project
* start the full project (client at localhost:5000) + show logs of containers
```bash
make start
make log
make stop
```
## debug or contribute to kernel
* You have to clone the semapps directory manually next to your project directory.
* start using semapps kernel sources (more information in "use semapps kernel source" chapiter) + show logs of containers
```bash  
make start-dev
make log-dev
make stop-dev
```
## start in production server
* change docker-compose.prod environement variable to match production environement
* If you are on a production server that benefits from domain (DNS redirection) you can activate https. Update docker-compose.prod replacing yourdomain by your real domain.
* if you don't have domain and you can only access your browser through its IP, remove traeffick mentions to docker-compose.prod.
* start in production mode + show logs of containers.
```bash  
make start-prod
make log-prod
make stop-prod
```
