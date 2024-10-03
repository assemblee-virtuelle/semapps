# Jena Fuseki with WAC extension

Custom version of Jena Fuseki which checks WAC permissions

For more information, see https://semapps.org/docs/triplestore

## Publishing

To publish the `semapps/jena-fuseki-webacl` image on AMD/ARM platforms, first create the [BuildX container](https://docs.docker.com/build/building/multi-platform/#create-a-custom-builder) with this command:

```
make init-container-builder
```

Then run this command to publish the image with the current version of SemApps:

```
make publish
```

Run this command to publish the image with the "latest" tag:

```
make publish
```
