# SemApps integration tests

## Run tests

Launch Fuseki, NextGraph and Redis

```bash
make start-test
```

Run a test suite (running all test suites at the same time may not work)

```bash
yarn run test ldp/resource
```

Clean up

```bash
make stop-test
```
