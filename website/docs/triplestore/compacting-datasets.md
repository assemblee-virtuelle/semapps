---
title: Compacting datasets
---

Jena Fuseki datasets must be regularly compacted, or they will become bigger and bigger until your hard drive is full.

Unfortunately, the endpoint to compact datasets (see [this page](https://jena.apache.org/documentation/fuseki2/fuseki-server-protocol.html)) 
cannot be used with SemApps-specific datasets. You have to stop Fuseki and launch a specific command.


## Launch the compaction

First stop your Fuseki container (`docker compose down`), then run the following command:

```
docker run --volume="$(pwd)"/data/fuseki:/fuseki --entrypoint=/docker-compact-entrypoint.sh semapps/jena-fuseki-webacl
```

> **Warning**: The volume path can be different on your setup. It has to be the exact same as the `volumes` line of the
> `fuseki` service present in your docker-compose file.

It will compact all datasets one by one, put them in new directories and then remove the old directories. Instead of 
`/Data-0001`, the data will now be stored in `/Data-0002` (for example).


## Bash script

Here's a script which can be launched with a cron job every night:

```bash
#!/bin/bash

# Add /usr/local/bin directory where docker-compose is installed
PATH=/usr/sbin:/usr/bin:/sbin:/bin:/usr/local/bin

cd ~/path-to-semapps-directory

# Stop all containers including Fuseki
docker compose down

# Run fuseki compact with same data as prod
docker run --volume="$(pwd)"/data/fuseki:/fuseki --entrypoint=/docker-compact-entrypoint.sh semapps/jena-fuseki-webacl

docker compose up -d

echo "Cron job finished at" $(date)
```

To call this script every night at 4am, call `crontab -e` and enter this line :

```
0 4 * * * /path/to/script.sh >> /home/cron-compact.log 2>&1
```
