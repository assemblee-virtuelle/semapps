# Jena Fuseki with WAC extension

Custom version of Jena Fuseki which checks WAC permissions

For more information, see https://semapps.org/docs/triplestore

## Memory

The JVM does not size itself from `-Xmx` only: metaspace, threads, GC overhead and the
TDB2 memory-mapped files all live outside the heap. A container whose memory limit is
close to `-Xmx` gets OOM-killed sooner or later.

The image therefore starts Fuseki with `-XX:MaxRAMPercentage=65.0` (heap capped at 65%
of the container memory limit) and `-XX:+ExitOnOutOfMemoryError` (exit and let Docker
restart the container instead of hanging in a GC loop). This only works if the container
**has** a memory limit, otherwise the JVM sizes the heap from the host's RAM:

```yaml
fuseki:
  image: semapps/jena-fuseki-webacl
  restart: unless-stopped
  deploy:
    resources:
      limits:
        memory: 3g
```

To override the defaults, set `JVM_ARGS` (e.g. `JVM_ARGS=-Xmx2g -XX:+ExitOnOutOfMemoryError`,
keeping the heap at roughly 60-65% of the container limit).

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
make publish-latest
```
