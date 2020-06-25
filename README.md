# SemApps

SemApps is an open source project which aims to **ease data storage and filtering**.

SemApps means Semantic Apps, thus storage and filtering are ontology driven.

- [Homepage](https://semapps.org)
- [About](https://semapps.org/docs/about)
- [Team](https://semapps.org/docs/governance/team)
- [Documentation](https://semapps.org/docs/guides/ldp-server)
- [How to contribute](https://semapps.org/docs/contribute/code)

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