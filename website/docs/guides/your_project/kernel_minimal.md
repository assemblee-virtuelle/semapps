---
title:  use semapps kernel source in minimal stack
---

## Purpose

Link semapps sources and your project without docker

## Prerequisites

see [initialize and configure your semapps application without docker](./init_minimal)

## get semapps kernel sources

clone semapps repository into your project's parent directory
```bash
git clone git@github.com:assemblee-virtuelle/semapps.git
```
## link and run
npm is used in this chapiter but yarn is à more efficient alternativ.

### link client packages

```bash
cd /semapps/src/frontend/packages/archipelago-layout
npm link
cd /semapps/src/frontend/packages/other-package
npm link
cd /yourproject/client
npm link @semapps/archipelago-layout
npm link @semapps/other-package
```
### rollup client packages

If you don't rollup clients package, you have to restart your project each time you change kernel source. rollup isn't mandatory if you want debog or understand kernel. It is required if you want to resolve a bug or contribute.
rollup compile the source code of the client's components to the dist directory when this code is updated.  

```bash
cd /semapps/src/frontend/packages/archipelago-layout
npm run dev
cd /semapps/src/frontend/packages/semantic-data-provider
npm run dev
```
### unlink client packages
unlink client package if you want to go back to the packages published on npmjs

```bash
cd /semapps/src/frontend/packages/archipelago-layout
npm unlink
cd /semapps/src/frontend/packages/other-package
npm unlink
cd /yourproject/client
npm unlink @semapps/archipelago-layout --no-save
npm unlink @semapps/other-package --no-save
npm install
```

## server

### link server packages
```bash
cd /semapps/src/middleware/packages/ldp
npm link
cd /semapps/src/middleware/packages/other-package
npm link
cd /yourproject/server
npm link @semapps/ldp
npm link @semapps/other-package
```
### unlink server package.
unlink server package if you want to go back to the packages published on npmjs

```bash
cd /semapps/src/middleware/packages/ldp
npm unlink
cd /semapps/src/frontend/packages/other-package
npm unlink
cd /yourproject/server
npm unlink @semapps/ldp --no-save
npm unlink @semapps/other-package --no-save
npm install
```
