---
title: init & configure your project in docker stack
---



## Purpose

initialize and configure your semapps application with docker
you don't need to use a docker to deploy semapps servers but it allows you to make sure that the development environnement and production environnement are the same.

## Prerequisites

- [docker-compose](https://docs.docker.com/compose/) & [docker](https://docs.docker.com/engine/)
- you can use [make](https://fr.wikipedia.org/wiki/Make) to simplify daily use
- Prerequisites of [minimal stack](./init_minimal#prerequisites)

## create semantic data base, server and interfaces

Process [minimal stack init](init_minimal) using [docker-compose](init_minimal#fuseky-not-ever-installed-but-docker-compose-installed)

### Docker
run your application throw docker containers instead host environment.
- server
  - create a Dockerfile.dev file at /serveur
  ```
  FROM node:13.14-alpine
  WORKDIR /server/app
  RUN apk add --update --no-cache git bash yarn nano autoconf libtool automake alpine-sdk
  CMD npm install && npm start

  ```


- client
  - create a Dockerfile file at /client
  ```
  FROM node:13.14-alpine
  WORKDIR /client/app
  RUN apk add --update --no-cache git bash yarn nano autoconf libtool automake alpine-sdk
  CMD npm install && npm start
  ```
- you can launch the docker containerswithout docker-compose but we advise you to use docker-compose. More information at [Docker-compose](./init_docker#docker-compose) chapiter. If you launch the container as it you need to add several instructions such as CMD to launch the NodeJs server and port opening and declare volumes and port mapping when launching the container.

### Docker-compose
Centralize the configuration of the environment and the technical stack thanks to docker-compose
- create a docker-compose.yaml file at the root of the project and replace "workbench" by the name of your project.
```
version: '3.5'
services:
  fuseki:
    image: stain/jena-fuseki:3.10.0
    container_name: fuseki-workbench
    volumes:
      - ./data/fuseki:/fuseki
      - ./data/staging:/staging
    ports:
      - "3030:3030"
    expose:
      - "3030"
    networks:
      - semapps
    environment:
      ADMIN_PASSWORD: "admin"
  middleware:
    build:
      context: ./server
      dockerfile: Dockerfile
    container_name: middleware-workbench
    depends_on:
      - fuseki
    volumes:
      - ./server/:/server/app
    environment:
      - SEMAPPS_SPARQL_ENDPOINT=http://fuseki-workbench:3030/
      - SEMAPPS_MAIN_DATASET=localData
      - SEMAPPS_JENA_USER=admin
      - SEMAPPS_JENA_PASSWORD=admin
      - SEMAPPS_HOME_URL=http://localhost:3000/
    networks:
      - semapps
    ports:
      - "3000:3000"
    expose:
      - "3000"
    command: bash -c "npm rebuild && npm install && npm start"
  frontend:
    build:
      context: ./client
      dockerfile: Dockerfile.dev
    container_name: frontend-workbench
    volumes:
      - ./client:/client/app
    environment:
      - REACT_APP_MIDDLEWARE_URL=http://localhost:3000/
      - PORT=5000
    networks:
      - semapps
    ports:
      - "5000:5000"
    expose:
      - "5000"
    command: bash -c "npm rebuild && npm install --silent && npm start"

networks:
  semapps:
    name: semapps_network
```
- explications
  - fuseki, middleware, frontend are the 3 containers launched. Fuseki configuration reuses the docker-compose.yml which is present on the /server repo.
  - build : point to previously created Dockerfile files
  - container_name : [optional] allows to better identify containers in case of a complex working environment with several other projects running on containers. You can replace workbench by the name of your project.
  - volumes : allows to establish a link between the content of the development directories of the workstation and a directory of the container. node_modules is voluntarily copied with the rest of the project but it is not necessary to make npm install in case of evolution of package.json because it is made at each start of the containers (see command).
  - environment : declaration of environment variables. That overwrite the variables defined in the .env file. If you use docker-composer, you no longer need the .env files.
  - networks : [optional] allows to name the network in which the containers can communicate together. If it is not specified docker-composes will create a default network. Declaring a network allows to several stack docker-composes to communicate together which is not possible if docker-composes creates a default network for each stack.
  - ports : matching between the internal port of the container and the external port accessible from the workstation.
  - expose : opening of the internal port of the containers
  - command : command to be executed when the container is started.
- start containers stack
```bash
docker-compose up
```
- start containers stack in daemon mode
```bash
docker-compose up -d
docker-compose logs middleware frontend fuseki
docker-compose down
```
### Make
Make linux tool is easiest way to manage scripts including multiple tools combination or many command asociation.
- basic commande
```
DOCKER_COMPOSE=docker-compose -f docker-compose.yaml

# Docker
build:
	$(DOCKER_COMPOSE) build

start:
	$(DOCKER_COMPOSE) up -d --force-recreate

log:
	$(DOCKER_COMPOSE) logs -f fuseki frontend middleware

stop:
	$(DOCKER_COMPOSE) down
```
