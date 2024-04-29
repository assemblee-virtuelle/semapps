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

Get list of all public-private key pairs of a given key type for an actor. Looks for keys in the `keys` container. If none of the given type is available, `[]` is returned.

##### Returns

No return value.

##### Emits

Emits event `keys.migration.migrated` with no payload.

### `isMigrated`

Checks if keys have been migrated to db store by checking if the filesystem contains any keys (usually in the `actors` directory).

##### Parameters

No parameters.

##### Return

Returns `true` if the keys are already migrated, `false` otherwise.
