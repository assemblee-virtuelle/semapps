---
title: Migrating datasets
---

If you have existing Fuseki datasets without the SemApps-specific configuration and wish to use the WebACL or mirror 
service, you will have to migrate them.

First stop your Docker containers (`docker-compose down`), then run the following command:

```
docker run -v "$(pwd)"/data/fuseki:/fuseki --entrypoint /docker-migration-entrypoint.sh semapps/jena-fuseki-webacl
```

> **Warning**: The volume path can be different on your setup. It has to be the exact same as the `volumes` line of the
> `fuseki` service present in your docker-compose file.

You can check that everything went well with the migration by starting the shell environment of the Fuseki service
(`docker-compose exec fuseki bash`), and doing `cat /fuseki/configuration/migration.log`.

If you see some errors in this file, or if your dataset configuration files were not standard and you had modified them,
then you need to do the migration manually. You can find the previous version of your configuration files with the 
extension `.bak`. To see the format of the dataset configuration you want to achieve manually, please refer to the 
templates [here](https://github.com/assemblee-virtuelle/semapps/tree/next/src/jena/fuseki-docker/migration/templates).
