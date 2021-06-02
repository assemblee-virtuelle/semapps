---
title: Contribute to the SemApps core
---

As a developer, you can choose to use SemApps as a library for your own project, in which case the [guides](../guides/ldp-server.md) will be your best friend.

On the other hand, if you want to contribute to the core of SemApps, this page is for you.

## Launch the stack locally

In a few commands, you can launch the full SemApps stack with:

- Middleware
- Frontend ([DMS](../guides/dms.md))
- A Jena Fuseki instance

### First time

You will need to install:

- [docker](https://docs.docker.com/install/)
- [docker-compose](https://docs.docker.com/compose/install/)
- [make](https://www.gnu.org/software/make/)

Then you can do:

```
git clone https://github.com/assemblee-virtuelle/semapps.git
cd semapps
make init
make build
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

## Getting data

If you want to have some semantic data to start experimenting, please contact us.


## Getting help

Our [Riot/Matrix chatroom](https://riot.im/app/#/room/#semapps:matrix.virtual-assembly.org) is the main entry point for all people who want to contribute.
