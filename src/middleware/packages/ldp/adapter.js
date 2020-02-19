const { ServiceSchemaError } = require('moleculer').Errors;
const { MIME_TYPES } = require('@semapps/mime-types');

class TripleStoreAdapter {
  constructor(ldpServiceName) {
    this.ldpServiceName = ldpServiceName;
  }

  init(broker, service) {
    this.broker = broker;
    this.service = service;

    if (!this.service.schema.settings.containerUri) {
      throw new ServiceSchemaError('Missing `containerUri` definition in settings of service!');
    }
  }

  connect() {
    // TODO create standard container
    return Promise.resolve();
  }

  disconnect() {
    return Promise.resolve();
  }

  /**
   * Find all entities by filters.
   *
   * Available filter props:
   * 	- limit
   *  - offset
   *  - sort
   *  - search
   *  - searchFields
   *  - query
   */
  find(filters) {
    return this.broker.call(this.ldpServiceName + '.standardContainer', {
      containerUri: this.service.schema.settings.containerUri,
      context: this.service.schema.settings.context,
      accept: MIME_TYPES.JSON
    });
  }

  /**
   * Find an entity by query
   */
  findOne(query) {
    throw new Error('Method not implemented');
  }

  /**
   * Find an entity by ID.
   */
  findById(_id) {
    return this.broker.call(this.ldpServiceName + '.get', { resourceUri: _id, accept: MIME_TYPES.JSON });
  }

  /**
   * Find all entities by IDs
   */
  findByIds(ids) {
    throw new Error('Method not implemented');
  }

  /**
   * Get count of filtered entites
   *
   * Available filter props:
   *  - search
   *  - searchFields
   *  - query
   */
  count(filters = {}) {
    throw new Error('Method not implemented');
  }

  /**
   * Insert an entity
   */
  insert(entity) {
    return this.broker
      .call(this.ldpServiceName + '.post', {
        containerUri: this.service.schema.settings.containerUri,
        resource: entity,
        contentType: MIME_TYPES.JSON,
        accept: MIME_TYPES.JSON
      })
      .then(body => {
        this.broker.call(this.ldpServiceName + '.attachToContainer', {
          containerUri: this.service.schema.settings.containerUri,
          objectUri: body['@id']
        });
        return body;
      });
  }

  /**
   * Insert multiple entities
   */
  insertMany(entities) {
    throw new Error('Method not implemented');
  }

  /**
   * Update many entities by `query` and `update`
   */
  updateMany(query, update) {
    throw new Error('Method not implemented');
  }

  /**
   * Update an entity by ID
   */
  updateById(_id, update) {
    const resource = update['$set'];
    return this.broker.call(this.ldpServiceName + '.patch', {
      resource: {
        '@context': this.service.schema.settings.context,
        '@id': _id,
        ...resource
      },
      accept: MIME_TYPES.JSON,
      contentType: MIME_TYPES.JSON
    });
  }

  /**
   * Remove many entities which are matched by `query`
   */
  removeMany(query) {
    throw new Error('Method not implemented');
  }

  /**
   * Remove an entity by ID
   */
  removeById(_id) {
    return this.broker.call(this.ldpServiceName + '.delete', {
      resourceUri: _id
    });
  }

  /**
   * Clear all entities from DB
   */
  clear() {
    throw new Error('Method not implemented');
  }

  /**
   * Convert DB entity to JSON object
   */
  entityToObject(entity) {
    return entity;
  }

  /**
   * Transforms 'idField' into MongoDB's '_id'
   */
  beforeSaveTransformID(entity, idField) {
    return entity;
  }

  /**
   * Transforms MongoDB's '_id' into user defined 'idField'
   */
  afterRetrieveTransformID(entity, idField) {
    return entity;
  }
}

module.exports = TripleStoreAdapter;
