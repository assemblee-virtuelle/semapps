# SemApps

SemApps is an open source projet which aim to **ease data storage and filtering**.
SemApps means Semantic Apps, thus storage and filtering are ontology driven

More information about the project http://semapps.org

# Usage

## Prerequisites
docker
docker-compose
[make](https://www.gnu.org/software/make/)

## First time (mandatory to dev, not to deploy)
```
make init
```
## All dev commands
### Build (not mandatory to start)
```
make build
```
### Start
```
make start
```
### Logs
```
make log
```
### Stop
```
make stop
```
## production commands

edit local env variables
```
nano src/middleware/boilerplates/runner/.env.local
```
first time : run the nginx certbot script
```
init-letsencrypt.sh
```

build and start
```
make build-prod
make start-prod

```

## Cleanup code
Please do this before every PR submission.
```
make prettier
```

# Contributing
We welcome contributors from everywhere. Please contact us to join the team.

- [Riot/Matrix chatroom](https://riot.im/app/#/room/#semapps:matrix.virtual-assembly.org)
- [Conventions](docs/conventions.md)
