---
title:  initialiser, configurer et déployer votre application semapps
---



### Purpose

initialize, configure and deploy your semapps application

- configuration of environment variables
- configuration of ontologies, context, resources, etc.
- docker + docker-compose
- connection to the source code of the semapps kernel for debugging and to be able to contribute
- deployment on a production environment (https, environment configuration)

### Prerequisites

If you want to use containers
- [docker-compose](https://docs.docker.com/compose/) & [docker](https://docs.docker.com/engine/)

If you don't want to use containers
- [NodeJS](https://nodejs.org/en/)

Dans un vrai projet, il est toujours nécessaire de disposer de plusieurs outils
- Make
- npm ou yarn

### Very short Launch
there is a way to launch a project very quickly : semapps-workbench https://github.com/assemblee-virtuelle/semapps-workbench
It is only a tool that simplifies the different manipulations that will be seen in this guide.

to start a poject
* fork semapps-workbench git repository : this is your directory for your project
* clone new repository on your local environment
* initialise & server server + initialise an DMS/archipelago client + set up containers infrastructure
```bash
make init
```
* start the full project (client at localhost:5000) + show logs of containers
```bash
make start
make log
make stop
```

* OR start using semapps kernel sources (more information in "use semapps kernel source" chapiter) + show logs of containers
```bash  
make start-dev
make log-dev
make stop-dev
```
* If you are on a production server that benefits from DNS redirection; start on a production server (more information in "production environment" chapiter) + show logs of containers.
```bash  
make start-prod
make log-prod
make stop-prod
```

### init a Project
#### create server, interface and configure them
##### create server and interface
to install the server, refer to https://semapps.org/docs/guides/ldp-server
```bash  
npm install -g moleculer-cli # instalm moleculer client to use moleculer template
moleculer init assemblee-virtuelle/semapps-template-ldp server #init a moleculer server thanks to template
cd server
docker-compose up #start fuseki + jenna
npm run dev
```
to install the interface, refer to https://semapps.org/docs/guides/dms  
you can use archipelago for better experience
```bash  
npx create-react-app client --template @semapps/dms-archipelago #init react applicaiotn thanks to template
cd client
npm start
```
##### environnement configuration
As long as docker is not used, environment variables are configured through the .env files on the client and on the server
- client
  - REACT_APP_MIDDLEWARE_URL
    - usage : url du server. le client va utiliser les apis de ce serveur
    - default value : http://localhost:3000/
  - PORT
    - usage : port de demarrage du client
    - default value : 5000
- server
  - SEMAPPS_HOME_URL
    - usage : url du server. Le serveur à besoin de connaitre sa propre adresse pour créer des triplet avec le bon uri
    - default value : http://localhost:3000/
  - SEMAPPS_SPARQL_ENDPOINT
    - usage : url du serveur fuseki
    - default value (only if you ask fuseki install) : http://localhost:3000/
  - SEMAPPS_MAIN_DATASET
    - usage: dataset principale pour stocker les triplets. Il est créé automatiquement si le micro-service fuseky-admin est utilisé et c'est le cas du template
    - default value : localData
  - SEMAPPS_JENA_USER / SEMAPPS_JENA_PASSWORD
    - usage : login et mot de passe du serveur fuseki
    - default value : admin / admin

##### application configuration
- client
  - /config/ontologies.json
    - usage : the list of ontologies used by the client. must be identical to the server. See /ontologies.json on the server below
  - /config/ressources.json
    - the resources (container+class) used by the client
    ```javascript  
    [
      RessourceName: {
        types: ['prefix:Class'],// Class affect to this Ressource
        containerUri: process.env.REACT_APP_MIDDLEWARE_URL + 'containerName', // url of the container which manage this ressource
        slugField: '?'
      }
    ]
    ```
    - default value
    ```javascript  
    [
      User: {
        types: ['foaf:Person'],
        containerUri: process.env.REACT_APP_MIDDLEWARE_URL + 'persons',
        slugField: ['foaf:name', 'foaf:familyName']
      }
    ]
    ```
  - /resources
    - usage : directory which contains the "screens" of the resources to display/modify. These screens are to be imported from App.js. See REACT-Admin.

- server
  - /ontologies.json
    - usage : list of used ontologies (must be identical to the client)
    ```javascript  
    [
      {
        "prefix": "pair",// prefix à utiliser pour les classes et les properties pour les serialisation json-ld e les prefix sparql
        "owl": "http://virtual-assembly.org/ontologies/pair/ontology.ttl",// adresse qui fourni un fichier ttl ou rdf qui décrit l'ontologie
        "url": "http://virtual-assembly.org/ontologies/pair#"// namespace complet à utiliser pour le stockage sémantque
      }
    ]
    ```

##### semapps-workbench
this step is done by make init on semapps-workbench but this command also does the container step below
```bash  
make init
```

### container
#### Docker
you don't need to use a docker to deploy semapps servers but it allows you to make sure that the development environnement and production environnement are the same.
- server
  - create a Dockerfile.dev five at /serveur
  ```
  FROM node:13.14-alpine
  WORKDIR /server/app
  RUN apk add --update --no-cache git bash yarn nano autoconf libtool automake alpine-sdk
  CMD npm install && npm start

  ```
  - you can launch the docker container as is but we advise you to use docker-compose. More information at "Docker-compose" chapiter. If you launch the container as is you need to add several instructions such as CMD to launch the NodeJs server and port opening and declare volumes and port mapping when launching the container.

- client
  - créer un fichier Dockerfile sur /client
  ```
  FROM node:13.14-alpine
  WORKDIR /client/app
  RUN apk add --update --no-cache git bash yarn nano autoconf libtool automake alpine-sdk
  CMD npm install && npm start
  ```
  - you can launch the docker container as is but we advise you to use docker-compose.  More information at "Docker-compose" chapiter. If you launch the container as is you need to add several instructions such as CMD to launch the NodeJs server and port opening and declare volumes and port mapping when launching the container.

#### Docker-compose
Centralize the configuration of the environment and the technical stack thanks to docker-compose
- create a docker-compose-.yaml file at the root of the project and replace "workbench" by the name of your project.
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
  - fuseki, middleware, frontend are the 3 containers launched. fuseki reuses the configuration of the docker-compose.yml which is present on the /server repo.
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
#### semapps-workbench
all these steps are included in the init command, which also contains the project initialization step.
```bash  
make init
```
### use semapps kernel source (debog and contributing)
Your project is based on semapps components published on npmjs. These components are imported when calling "npm install". These components are optimized for deployment which can complicate their debugging if needed. If you want to debug, experiment or contribute on the core components of semapps, you must establish a link between your project and the source code of the components.

- clone semapps repository into your project's parent directory
```bash
git clone git@github.com:assemblee-virtuelle/semapps.git
```
#### link and run
##### without docker
npm is used in this chapiter but yarn is à more efficient alternativ.
###### client
- link client packages
```bash
cd /semapps/src/frontend/packages/archipelago-layout
npm link
cd /semapps/src/frontend/packages/other-package
npm link
cd /yourproject/client
npm link @semapps/archipelago-layout
npm link @semapps/other-package

```
- rollup client packages. Before starting the client project it is necessary to compile the source code of the components when this code is updated to compile the dist directory.  
```bash
cd /semapps/src/frontend/packages/archipelago-layout
npm run dev
cd /semapps/src/frontend/packages/semantic-data-provider
npm run dev
```
- unlink client package. If you want to go back to the packages published on npmjs
```bash
cd /semapps/src/frontend/packages/archipelago-layout
npm unlink
cd /semapps/src/frontend/packages/other-package
npm unlink
cd /yourproject/client
npm unlink @semapps/archipelago-layout --no-save
npm unlink @semapps/other-package --no-save
npm install
```

###### server

- link server packages
```bash
cd /semapps/src/middleware/packages/ldp
npm link
cd /semapps/src/middleware/packages/other-package
npm link
cd /yourproject/server
npm link @semapps/ldp
npm link @semapps/other-package
```
- unlink server package. Si vous voulez revenir au packages publiées sur npmjs
```bash
cd /semapps/src/middleware/packages/ldp
npm unlink
cd /semapps/src/frontend/packages/other-package
npm unlink
cd /yourproject/server
npm unlink @semapps/ldp --no-save
npm unlink @semapps/other-package --no-save
npm install
```
##### with docker
###### volumes
- we advise you to create another file like docker-compose.dev.yml. The docker-compose file proposed in the chapter above already contains a volume to the source codes of your application. You have to add the source code of the semapps kernel.
```
middleware:
  volumes:
    - ./server/:/server/app
    - ./../semapps:/semapps
frontend:
  volumes:
    - ./client:/client/app
    - ./../semapps:/semapps
```
###### make link
- to make links easier, we advise you to create a Makefile in the directories /client and server/ with instructions comparable to the chapter "link and run / without docker" above and which has the instruction link. this will also allow you to activate the link and unlink easily.
####### client
```
SEMAPPS_PATH=./../../semapps

install :
	npm install --force

rollup :
	npm run dev --prefix $(SEMAPPS_PATH)/src/frontend/packages/archipelago-layout &
	npm run dev --prefix $(SEMAPPS_PATH)/src/frontend/packages/other-package

link:
	cd $(SEMAPPS_PATH)/src/frontend/packages/archipelago-layout && yarn link
	yarn link @semapps/archipelago-layout
	cd $(SEMAPPS_PATH)/src/frontend/packages/other-package && yarn link
	yarn link @semapps/other-package

unlink:
	yarn unlink @semapps/archipelago-layout --no-save
	cd $(SEMAPPS_PATH)/src/frontend/packages/archipelago-layout && yarn unlink
	yarn unlink @semapps/other-package--no-save
	cd $(SEMAPPS_PATH)/src/frontend/packages/other-package && yarn unlink
	make install
```
####### server
```
SEMAPPS_PATH=./../../semapps

install :
	npm install --force

link:
	cd $(SEMAPPS_PATH)/src/middleware/packages/ldp && yarn link
	yarn link @semapps/ldp
	cd $(SEMAPPS_PATH)/src/middleware/packages/other-package && yarn link
	yarn link @semapps/other-package

unlink:
	yarn unlink @semapps/ldp --no-save
	cd $(SEMAPPS_PATH)/src/middleware/packages/ldp && yarn unlink
	yarn unlink @semapps/other-package--no-save
	cd $(SEMAPPS_PATH)/src/middleware/packages/other-package && yarn unlink
	make install
```
###### command
Le fichier Makefile va être intégré dans les fichier qui seront inclue dans les volumes de container. Il est nécessaire d'appeler ce commandes avant de démarrer les serveurs NodeJs pour que l’édition du code source de semmapps soit pris en compte par les container en cours d’exécution.
The Makefile file will be integrated whith others files in the container thanks to volumes. It is necessary to call command above before starting the NodeJs servers so that the edition of the semmapps source code impact the running containers.
```
middleware:
  volumes:
    - ./server/:/server/app
    - ./../semapps:/semapps
  command: bash -c "make install && make link && npm start"
frontend:
  volumes:
    - ./client:/client/app
    - ./../semapps:/semapps
  command: bash -c "make rollup & make install && make link && npm start"
```
#### contributing
Thanks to the link you can find a bug or improve semapps with a new feature. To do so, [follow the guide](https://semapps.org/docs/contribute/code).
#### semapps-workbench
You have to clone the semapps directory manually as shown above
##### without docker
  - npm
  ```bash
  make link
  ```
  - yarn
  ```bash
  make link-yarn
  ```
##### with docker
```bash
make start
make log
make stop
```

### production environment
#### difference whith developpment environnement
##### server
SEMAPPS_HOME_URL environment variable have to considere accessible external url. ex : https://yourdomain/middleware/ or https://middleware.yourdomain/

##### client
REACT_APP_MIDDLEWARE_URL environment variable have to considere accessible external url of server and is usally same as  SEMAPPS_HOME_URL.  
Dockerfile have to include serve install and run it on dockerfile CMD or docker-compose command
- Dockerfile.prod
```bash
npm install -g serve
CMD serve -s build -l 5000
```
- docker-compose.prod
```
middleware:
  command: bash -c "npm install && serve -s build -l 5000"
```
#### https
most of production configuration have to include https. We recommend you to set up traefik in docker compose.
```
traefik:
  image: "traefik:v2.3"
  container_name: "traefik-workbench"
  networks:
    - semapps
  command:
    # - "--log.level=DEBUG"
    - "--api.insecure=true"
    - "--providers.docker=true"
    - "--providers.docker.exposedbydefault=false"
    - "--entrypoints.web.address=:80"
    - "--entrypoints.websecure.address=:443"
    - "--certificatesresolvers.myresolver.acme.tlschallenge=true"
    - "--certificatesresolvers.myresolver.acme.email=yourmail"
    - "--certificatesresolvers.myresolver.acme.storage=/letsencrypt/acme.json"
  ports:
    - "80:80"
    - "443:443"
    - "8080:8080"
  volumes:
    - "./letsencrypt:/letsencrypt"
    - "/var/run/docker.sock:/var/run/docker.sock:ro"
middleware:
  labels:
    - "traefik.enable=true"
    - "traefik.http.routers.middleware.rule=Host(`yourdomain`) && PathPrefix(`/middleware/`)"
    - "traefik.http.routers.middleware.entrypoints=websecure"
    - "traefik.http.routers.middleware.tls.certresolver=myresolver"

frontend:
  labels:
    - "traefik.enable=true"
    - "traefik.http.routers.frontend.rule=Host(`yourdomain`)"
    - "traefik.http.routers.frontend.entrypoints=websecure"
    - "traefik.http.routers.frontend.tls.certresolver=myresolver"
```
#### semapps-workbench
update docker-compose.prod replacing yourdomain by your real domain.
```bash
make start-prod
make log-prod
make stop-prod
```
### developpment tool
- [facultatif] set up a Makefile at the root to trigger executions more easily. exemples at [Makefile](https://github.com/assemblee-virtuelle/semapps-workbench/blob/main/Makefile) of semapps-workbench
