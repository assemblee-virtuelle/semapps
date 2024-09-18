# Jena Fuseki with WAC extension

Custom version of Jena Fuseki which checks WAC permissions

For more information, see https://semapps.org/docs/triplestore

## Publishing

To publish the `semapps/jena-fuseki-webacl` image on AMD/ARM platforms, first create the [BuildX container](https://docs.docker.com/build/building/multi-platform/#create-a-custom-builder):

```
docker buildx create --name container-builder --driver docker-container --use --bootstrap
```

Then run this command:

```
COMPOSE_DOCKER_CLI_BUILD=1 DOCKER_BUILDKIT=1 docker compose build --push fuseki
```
