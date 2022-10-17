---
title: Contribute to the SemApps core
---

As a developer, you can choose to use SemApps as a library for your own project, in which case the [guides](guides/ldp-server.md) will be your best friend.

On the other hand, if you want to contribute to the core of SemApps, this page is for you.


## Linking SemApps packages from other projects

To modify packages on the SemApps repository and see the changes before they are published, we recommend to use [`yarn link`](https://classic.yarnpkg.com/en/docs/cli/link/).

### Middleware packages

```bash
cd /SEMAPPS_REPO/src/middleware
yarn run link-all
cd /PRODUCT_REPO/middleware
yarn run link-semapps-packages
```

### Frontend packages

```bash
cd /SEMAPPS_REPO/src/frontend
yarn run link-all
cd /PRODUCT_REPO/frontend
yarn run link-semapps-packages
```

Additionally, frontend packages need to be rebuilt, or your changes will not be taken into account.
You can use `yarn run build` to build a package once, or `yarn run dev` to rebuild a package on every change.


## Publishing packages

This requires to have write rights on the @semapps NPM packages. Ask us if you need it !

### Middleware packages

```bash
cd src/middleware
yarn run version
yarn run publish
```

> Do not forget to create a release from the newly-created [tag](https://github.com/assemblee-virtuelle/semapps/tags)

### Frontend packages

```bash
cd src/frontend
yarn run build   # Build all frontend packages
yarn run version
yarn run publish
```

> Do not forget to create a release from the newly-created [tag](https://github.com/assemblee-virtuelle/semapps/tags)


## Getting help

Our [chatroom](https://chat.lescommuns.org/channel/semapps_dev) is the main entry point for all people who want to contribute.
