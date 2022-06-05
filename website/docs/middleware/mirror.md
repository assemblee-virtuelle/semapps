---
title: Mirror service
---

This service enables your server to become a mirror of one or more other semapps servers, and/or to offer the option to other servers to mirror you.

Only the public data can be mirrored. If your server is using webacl, then the `anon/read` permission should be set if you want the data to be mirrored.

## Note to developers of semapps

If you are using `yarn` and its ability to create a dev env where the packages in semapps main repo are linked to your test instance (you probably do), then there is a new package called `@semapps/mirror` and it need to be linked locally.

in `src/middleware` run the command `yarn run link-all`

in your lcal test instance of semapps (whatever that be), if in your `package.json` file you had added 2 lines for the scripts `link-semapps-packages` and `unlink-semapps-packages`, then you should now add `@semapps/mirror` in those lines.

then run the command `link-semapps-packages` from this test instance of the middleware.

## Installation

If you were running a previous version of the middleware and/or of jena fuseki docker image, you will need to migrate your dataset configuration(s). In order to do that, follow the steps in the Migration section

### Migration

- remove the current image version of the docker image
```
docker image rm -f semapps/jena-fuseki-webacl
```

- pull the newer version from docker.io
```
docker image pull semapps/jena-fuseki-webacl 
```

- in your docker-compose.yaml file, add the following block
```
  fuseki_migrate:
    build:
      context: fuseki-docker
      dockerfile: Dockerfile
    entrypoint: /docker-migration-entrypoint.sh
    image: semapps/jena-fuseki-webacl
    container_name: fuseki_migration
    volumes:
      - ./data/rdf_data:/fuseki
```
the last line (about the volume) can be different on your setup. It has to be the exact same as the volumes line of the `fuseki:` service present in your docker-compose file.

- run `docker-compose up` to recreate your services. This will add a new service called fuseki_migrate, and it will run it. This service is actually just migrating the configuration files for your datasets.

- you can check that everything went well with the migration by starting the shell environment of the fuseki service, and doing `cat /fuseki/configuration/migration.log`. If you see some errors in this file, or if your dataset configuration files were not standard and you had modified them, then you need to do the migration manually. you can find the previous version of your configuration files with the extension `.bak`. To see the format of the dataset configuration you want to achieve manually, please refer to the templates [here](https://github.com/assemblee-virtuelle/semapps/tree/next/src/jena/fuseki-docker/migration/templates).

- once it has run successfully, you have to remove this service from your docker-compose and from your docker system. It is not needed to keep it.

- you can now restart your jena instance, and should be ready to support the mirror service.

### Adding and configuring the service

In order to use this service you will need to add `@semapps/mirror` to your npm `package.json`, by using the command `npm i @semapps/mirror --save`.

Then you have to create this new service somehow. If you use text files to configure your moleculer services, create a file `mirror.service.js` that will look someting like this : 
```
const MirrorService = require('@semapps/mirror');
const CONFIG = require('../config'); // check this line. your config file might be somewhere else.

module.exports = {
  mixins: [MirrorService],
  settings: {
    baseUrl: CONFIG.HOME_URL,
  } 
};
```

This is the minimum if you just want your server to offer to other servers the option to mirror your data.

If you also want your server to mirror data from other servers, you have to add the `servers` parameter in settings, which will contain a list of URLs to the root container of the semapps server you want to mirror.
```
    servers: ['https://otherserver.com'],
```

If you want to mirror others, but not to offer any service of mirroring yourself, you have to add the option :
```
    acceptFollowers: false,
```

An important step is also to make sure that your server has a `/users` container. The mirror service will create an ActivityPub actor there, with the name `relay`. The configuration of this container should look like this :
```
{
  path: '/users',
  acceptedTypes: ['pair:Person','Application'],
  dereference: ['sec:publicKey'],
  excludeFromMirror: true
},
```

The `Application` in `acceptedTypes` is important.

You most probably want to use the option `excludeFromMirror: true`. It will hide this container from the mirroring servers.

If other containers need to be hidden and not available for mirroring, you can use this option too for them.

the mirroring service works with or without the webacl service on. If you do not have webacl on, the option `excludeFromMirror` is a simple way to hide containers.

## Usage

The service works automatically.

It offers a VOID endpoint at `http://yourserver.com/.well-known/void` that will list all the containers available for mirroring.

At the first launch of the service, the public data of all the servers listed for mirroring, are downloaded (via the LDP protocol) and inserted into a separate graph called `http://semapps.org/mirror`.

This graph is not directly editable.

Then your server will follow the ActivityPub relay actor of the remote server you are mirroring.
Everytime some data changes occur on the remote server, your server will receive an Annouce activity and will update its local mirror of the data.

You can retrieve the mirrored data with `LDP GET` and you can also link to this data inside your containers, with `LDP PATCH`.

### `ldp.container.patch`

When attaching a remote resource to a local container with `PATCH`, if the remote server has not been mirrored yet locally, the mirror service will mirror only that resource. It will then periodically refresh that resource's data to keep it in sync with the remote server.

This feature is independant of the mirror service and is always active when the ldp service is running.