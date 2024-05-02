---
title: Migration Service
---

Service to migrate keys from the deprecated `KeypairService` to the new `KeyService`. The old one uses a file system key store, the new one stores keys in the db.
Note, you can only use the new key service if you have migrated your keys.

# Migration to the new key service store

## Features

- Check, if keys have been migrated
- Migrate keys

## Settings

See [KeyService](./key-service) for settings.

## Actions

The following service actions are available.

### `migrateKeysToDb`

Migrate all available keys from the filesystem to the db store.

##### Returns

No return value.

##### Emits

Emits event `keys.migration.migrated` with no payload.

### `isMigrated`

Checks if keys have been migrated to db store by checking if the filesystem's `actorsKeyPairsDir` contains any `.key` or `.key.pub` files (usually in the `actors` directory).

##### Parameters

No parameters.

##### Return

Returns `true` if the keys are already migrated, `false` otherwise.
