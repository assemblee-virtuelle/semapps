# @semapps/triplestore

Triple store module for SemApps with support for multiple backends.

## Supported Backends

- **Fuseki**: Apache Jena Fuseki SPARQL server
- **NextGraph**: NextGraph triple store

## Configuration

The module automatically detects which backend to use based on your configuration.

### Fuseki Configuration

```javascript
{
  name: 'triplestore',
  mixins: [TripleStoreService],
  settings: {
    url: 'http://localhost:3030',
    user: 'admin',
    password: 'password',
    mainDataset: 'main'
  }
}
```

### NextGraph Configuration

```javascript
{
  name: 'triplestore',
  mixins: [TripleStoreService],
  settings: {
    nextgraphConfig: '/path/to/nextgraph/config',
    nextgraphAdminUserId: 'admin-user-id',
    nextgraphMappingsNuri: 'http://semapps.org/mappings',
    mainDataset: 'main'
  }
}
```

### Explicit Backend Selection

You can also explicitly specify the backend type:

```javascript
{
  name: 'triplestore',
  mixins: [TripleStoreService],
  settings: {
    backend: 'fuseki', // or 'nextgraph'
    url: 'http://localhost:3030',
    user: 'admin',
    password: 'password',
    mainDataset: 'main'
  }
}
```

## Backward Compatibility

Existing configurations continue to work without any changes. The module automatically detects the backend type based on the provided settings.

## API

The module provides the same API regardless of the backend used:

- `triplestore.query` - Execute SPARQL queries
- `triplestore.update` - Execute SPARQL updates
- `triplestore.insert` - Insert triples
- `triplestore.dropAll` - Drop all data
- `triplestore.countTriplesOfSubject` - Count triples for a subject
- `triplestore.tripleExist` - Check if a triple exists
- `triplestore.deleteOrphanBlankNodes` - Delete orphan blank nodes

## Dependencies

- **Fuseki**: Uses `node-fetch` for HTTP communication
- **NextGraph**: Uses the `nextgraph` SDK (optional dependency)
