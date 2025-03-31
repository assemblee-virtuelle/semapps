---
title: Plugins
---

The `plugins` config passed to the semantic data provider allow to use plugins. For now, plugins can do a single thing: transform the initial configuration of the semantic data provider, for example to preload container information.

## Available plugins

### `fetchVoidEndpoints`

This plugin will fetch the [VoID endpoint](https://www.w3.org/TR/void/) of all storages, and define the containers and their classes based on that information.

```js
import { dataProvider, fetchVoidEndpoints } from '@semapps/semantic-data-provider';

export default dataProvider({
  plugins: [fetchVoidEndpoints()],
  ...
});
```

If you know a server has no VoID endpoint, you may set `void: false` in the container definition.

### `configureUserStorage`

This plugin automatically defines a Solid storage linked with the logged-in user. It will load:

- The base URL of the user's storage
- The SPARQL endpoint
- The proxy URL

Additionally, it will set the JSON-LD context to be the same as the Pod providers.

```js
import { dataProvider, configureUserStorage } from '@semapps/semantic-data-provider';

export default dataProvider({
  plugins: [configureUserStorage()],
  ...
});
```

Containers in the user's storage are not automatically loaded. You must use the other plugins below for that.

### `fetchDataRegistry`

This plugin automatically load the [Data Registry](https://solid.github.io/data-interoperability-panel/specification/#data-registry) of the logged-in user. It fetches all Data Registration, and load the containers definitions (including the `label`, `labelPredicate` and `shapeTreeUri`). You need to load the `configureUserStorage` plugin first.

```js
import { dataProvider, configureUserStorage, fetchDataRegistry } from '@semapps/semantic-data-provider';

export default dataProvider({
  plugins: [configureUserStorage(), fetchDataRegistry()],
  ...
});
```

### `fetchAppRegistration`

This plugin automatically load the [Application Registration](https://solid.github.io/data-interoperability-panel/specification/#application-registration) of the current application. It fetches all Data Grants associated with this registration, and load the containers definitions (including the `label`, `labelPredicate` and `shapeTreeUri`). You need to load the `configureUserStorage` plugin first.

```js
import { dataProvider, configureUserStorage, fetchAppRegistration } from '@semapps/semantic-data-provider';

export default dataProvider({
  plugins: [configureUserStorage(), fetchAppRegistration()],
  ...
});
```

If no application registration is found, it does nothing.

### `fetchTypeIndexes`

This plugin automatically load the public and private [Type Indexes](https://github.com/solid/type-indexes) of the logged-in user. It maps all Type Registrations with containers definitions. If no `label` is set yet, it automatically sets an english with the formatted class name.

You need to load the `configureUserStorage` plugin first.

```js
import { dataProvider, configureUserStorage, fetchTypeIndexes } from '@semapps/semantic-data-provider';

export default dataProvider({
  plugins: [configureUserStorage(), fetchTypeIndexes()],
  ...
});
```

## Writing your own plugin

Plugins are objects with a single `transformConfig` method, which takes the data provider configuration and return a new configuration.

We recommend to setup plugins with a function, in case you want to add parameters later.

```ts
import { Configuration, Plugin } from '@semapps/semantic-data-provider';

const myCustomPlugin = (): Plugin => ({
  transformConfig: async (config: Configuration) => {
    if (...) {
      const newConfig = { ...config } as Configuration;

      // Do changes to the configuration

      // Return the modified config
      return newConfig;
    }

    // No changes, return the config "as is"
    return config;
  }
```
