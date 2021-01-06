---
title: use semapps kernel source in docker stack
---

## Purpose

Link semapps sources and your project with docker.

## Prerequisites

- [make](https://fr.wikipedia.org/wiki/Make)
- Prerequisites of [docker stack](./init_docker#prerequisites)

## get semapps kernel sources

same as [get semapps kernel sources in minimal stack](./kernel_minimal#get-semapps-kernel-sources)

## links thanks to Make
To make links easier, we advise you to create a Makefile file in the directories /client and server/ with instructions comparable to the chapter [link and run in minimal stack](./kernel_minimal#link-and-run). This will allow you to activate the link and unlink easily and files will be used in next chapiter in docker-compose.

### client
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

### server
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
## run in docker-compose

We advise you to create another file like docker-compose.dev.yml and copy docker-compose.yml content provided in [init & configure your project in docker stack](./docker). Previous file already contains a volume to the source codes of your application. You have to add the source code of the semapps kernel.

```
middleware:
  volumes:
    - ./server/:/server/app
    - ./../semapps:/semapps
```
```
frontend:
  volumes:
    - ./client:/client/app
    - ./../semapps:/semapps
```

## activ links in docker-compose

The Makefile files you created before will be integrated whith others files in the container thanks to volumes. It is necessary to call command of those files before starting the NodeJs servers so that the modification of the semmapps source code impact the running containers.
```
middleware:
  volumes:
    - ./server/:/server/app
    - ./../semapps:/semapps
  command: bash -c "make install && make link && npm start"
```
```
frontend:
  volumes:
    - ./client:/client/app
    - ./../semapps:/semapps
  command: bash -c "make rollup & make install && make link && npm start"
```
Moleculer (NodeJs) restart if sources are modified but react don't restart if semapps kernel react component are modified. That's why rollup is requiered.
