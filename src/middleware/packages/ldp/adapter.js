const { ServiceSchemaError } = require('moleculer').Errors;

class TripleStoreAdapter {
  constructor() {}

  init(broker, service) {
    this.broker = broker;
    this.service = service;

    if (!this.service.schema.settings.containerUri) {
      throw new ServiceSchemaError('Missing `containerUri` definition in settings of service!');
    }
  }

  connect() {
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
    return this.broker.call('ldp.standardContainer', {
      containerUri: this.service.schema.settings.containerUri,
      context: this.service.schema.settings.context,
      accept: 'application/ld+json'
    });
  }

  /**
   * Find an entity by query
   */
  findOne(query) {
    // return this.collection.findOne(query);
  }

  /**
   * Find an entity by ID.
   */
  findById(_id) {
    return this.broker.call('ldp.get', { resourceUri: _id, accept: 'application/ld+json' });
  }

  /**
   * Find all entities by IDs
   */
  findByIds(ids) {
    // return new Promise((resolve, reject) => {
    //   this.db.find({ _id: { $in: ids } }).exec((err, docs) => {
    //     /* istanbul ignore next */
    //     if (err)
    //       return reject(err);
    //
    //     resolve(docs);
    //   });
    //
    // });
  }

  /**
   * Get count of filtered entites
   *
   * Available filter props:
   *  - search
   *  - searchFields
   *  - query
   */
  count(filters = {}) {}

  /**
   * Insert an entity
   */
  insert(entity) {
    return this.broker
      .call('ldp.post', {
        containerUri: this.service.schema.settings.containerUri,
        ...entity
      })
      .then(body => {
        this.broker.call('ldp.attachToContainer', {
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
    // return this.db.insert(entities);
  }

  /**
   * Update many entities by `query` and `update`
   */
  updateMany(query, update) {
    // return this.db.update(query, update, { multi: true }).then(res => res[0]);
  }

  /**
   * Update an entity by ID
   */
  updateById(_id, update) {
    // return this.db.update({ _id }, update, { returnUpdatedDocs: true }).then(res => res[1]);
  }

  /**
   * Remove many entities which are matched by `query`
   */
  removeMany(query) {
    // return this.db.remove(query, { multi: true });
  }

  /**
   * Remove an entity by ID
   */
  removeById(_id) {
    // return this.db.remove({ _id });
  }

  /**
   * Clear all entities from DB
   */
  clear() {
    // return this.db.remove({}, { multi: true });
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
