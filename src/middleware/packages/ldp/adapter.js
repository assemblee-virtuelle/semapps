const { ServiceSchemaError } = require('moleculer').Errors;
const { MIME_TYPES } = require('@semapps/mime-types');

class TripleStoreAdapter {
  constructor({ resourceService = 'ldp.resource', containerService = 'ldp.container' } = {}) {
    this.resourceService = resourceService;
    this.containerService = containerService;
  }

  init(broker, service) {
    this.broker = broker;
    this.service = service;
  }

  async connect() {
    if (!this.service.schema.settings.containerUri) {
      throw new ServiceSchemaError('Missing `containerUri` definition in settings of service!');
    }

    await this.broker.waitForServices([this.resourceService, this.containerService], 120000);

    const containerUri = this.service.schema.settings.containerUri;
    const exists = await this.broker.call(this.containerService + '.exist', { containerUri });

    if (!exists) {
      console.log(`Container ${containerUri} doesn't exist, creating it...`);
      await this.broker.call(this.containerService + '.create', { containerUri });
    }
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
    return this.broker.call(this.resourceService + '.get', {
      containerUri: this.service.schema.settings.containerUri,
      expand: this.service.schema.settings.expand,
      jsonContext: this.service.schema.settings.context,
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
    return this.broker.call(this.resourceService + '.get', {
      resourceUri: _id,
      expand: this.service.schema.settings.expand,
      jsonContext: this.service.schema.settings.context,
      accept: MIME_TYPES.JSON
    });
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
      .call(this.resourceService + '.post', {
        containerUri: this.service.schema.settings.containerUri,
        resource: entity,
        contentType: MIME_TYPES.JSON
      })
      .then(resourceUri => {
        this.broker.call(this.containerService + '.attach', {
          containerUri: this.service.schema.settings.containerUri,
          resourceUri
        });

        return this.broker.call(this.resourceService + '.get', {
          resourceUri,
          expand: this.service.schema.settings.expand,
          jsonContext: this.service.schema.settings.context,
          accept: MIME_TYPES.JSON
        });
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
    return this.broker
      .call(this.resourceService + '.patch', {
        resource: {
          '@context': this.service.schema.settings.context,
          '@id': _id,
          ...resource
        },
        contentType: MIME_TYPES.JSON
      })
      .then(resourceUri => {
        return this.broker.call(this.resourceService + '.get', {
          resourceUri,
          expand: this.service.schema.settings.expand,
          jsonContext: this.service.schema.settings.context,
          accept: MIME_TYPES.JSON
        });
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
    return this.broker
      .call(this.resourceService + '.delete', {
        resourceUri: _id
      })
      .then(() => {
        // We must return the number of deleted resource
        // Otherwise the DB adapter returns an error
        return 1;
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
