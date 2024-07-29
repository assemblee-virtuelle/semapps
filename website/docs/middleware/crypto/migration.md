---
title: MigrationService
---

Service to migrate keys from the deprecated [`KeypairService`](keypair) to the new [`KeysService`](keys). The old one uses a file system key store, the new one stores keys in the triple store. Note, you can only use the new keys service if you have migrated your keys.

## Features

- Check if keys have been migrated
- Migrate keys

## Settings

See [KeysService](./keys) for settings.

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
