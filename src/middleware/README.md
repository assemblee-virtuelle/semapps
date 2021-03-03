# SemApps Middleware

### Install

```
npm run bootstrap
```

### Run

```
cd boilerplates/runner
npm start
```

### Add package

Exemple: To add an npm package dependency for 'supercoolpkg' into the lerna package triplestore :
```
cd src/middleware
lerna add supercoolpkg --scope=@semapps/triplestore
```

### Cleanup code

Please do this before every PR submission.

```
npm run prettier
```
