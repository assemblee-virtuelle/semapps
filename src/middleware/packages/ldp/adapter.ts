import urlJoin from 'url-join';

import { Errors } from 'moleculer';

const { ServiceSchemaError } = Errors;

class LdpAdapter {
  constructor({ resourceService = 'ldp.resource', containerService = 'ldp.container' } = {}) {
    this.resourceService = resourceService;
    this.containerService = containerService;
  }

  init(broker: any, service: any) {
    this.broker = broker;
    this.service = service;
  }

  async connect() {
    if (!this.service.schema.settings.containerUri) {
      throw new ServiceSchemaError(
        `Missing \`containerUri\` definition in settings of service ${this.service.schema.name}`
      );
    }

    await this.broker.waitForServices([this.resourceService, this.containerService], 120000);

    const { containerUri } = this.service.schema.settings;
    const exists = await this.broker.call(`${this.containerService}.exist`, { containerUri, webId: 'system' });

    if (!exists) {
      console.log(`Container ${containerUri} doesn't exist, creating it...`);
      await this.broker.call(`${this.containerService}.create`, { containerUri });
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
  find(filters: any) {
    return this.broker.call(`${this.containerService}.get`, {
      containerUri: this.service.schema.settings.containerUri,
      filters: filters.query,
      jsonContext: this.service.schema.settings.context
    });
  }

  /**
   * Find an entity by query
   */
  findOne(query: any) {
    throw new Error('Method not implemented');
  }

  /**
   * Find an entity by ID.
   */
  findById(_id: any) {
    if (!_id.startsWith('http')) {
      _id = urlJoin(this.service.schema.settings.containerUri, _id);
    }
    return this.broker.call(`${this.resourceService}.get`, {
      resourceUri: _id,
      jsonContext: this.service.schema.settings.context
    });
  }

  /**
   * Find all entities by IDs
   */
  findByIds(ids: any) {
    return Promise.all(ids.map((id: any) => this.findById(id)));
  }

  /**
   * Get count of filtered entities
   *
   * Available filter props:
   *  - search
   *  - searchFields
   *  - query
   */
  count(filters = {}) {
    return this.find(filters).then((result: any) => result['ldp:contains'].length);
  }

  /**
   * Insert an entity
   */
  insert(entity: any) {
    const { slug, ...resource } = entity;

    return this.broker
      .call(`${this.resourceService}.post`, {
        containerUri: this.service.schema.settings.containerUri,
        resource: {
          '@context': this.service.schema.settings.context,
          ...resource
        },
        slug
      })
      .then((resourceUri: any) => {
        this.broker.call(`${this.containerService}.attach`, {
          containerUri: this.service.schema.settings.containerUri,
          resourceUri
        });

        return this.findById(resourceUri);
      });
  }

  /**
   * Insert multiple entities
   */
  insertMany(entities: any) {
    throw new Error('Method not implemented');
  }

  /**
   * Update many entities by `query` and `update`
   */
  updateMany(query: any, update: any) {
    throw new Error('Method not implemented');
  }

  /**
   * Update an entity by ID
   */
  updateById(_id: any, update: any) {
    const { id, '@id': arobaseId, ...resource } = update.$set;

    // Check ID and transform it to URI if necessary
    _id = _id || id || arobaseId;
    if (!_id) throw new Error('An ID must be specified to update resources');
    if (!_id.startsWith('http')) _id = urlJoin(this.service.schema.settings.containerUri, _id);

    return this.broker
      .call(`${this.resourceService}.put`, {
        resource: {
          '@context': this.service.schema.settings.context,
          '@id': _id,
          ...resource
        }
      })
      .then((resourceUri: any) => this.findById(resourceUri));
  }

  /**
   * Remove many entities which are matched by `query`
   */
  removeMany(query: any) {
    throw new Error('Method not implemented');
  }

  /**
   * Remove an entity by ID
   */
  removeById(_id: any) {
    return this.broker
      .call(`${this.resourceService}.delete`, {
        resourceUri: _id
      })
      .then(() => {
        // We must return the number of deleted resource
        // Otherwise the DB adapter returns an error
        return 1;
      });
  }

  /**
   * Clear all entities from the container
   */
  clear() {
    return this.broker.call(`${this.containerService}.clear`, {
      containerUri: this.service.schema.settings.containerUri
    });
  }

  /**
   * Convert DB entity to JSON object
   */
  entityToObject(entity: any) {
    return entity;
  }

  /**
   * Transforms 'idField' into MongoDB's '_id'
   */
  beforeSaveTransformID(entity: any, idField: any) {
    return entity;
  }

  /**
   * Transforms MongoDB's '_id' into user defined 'idField'
   */
  afterRetrieveTransformID(entity: any, idField: any) {
    return entity;
  }
}

export default LdpAdapter;
