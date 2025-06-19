import urlJoin from 'url-join';
import { MIME_TYPES } from '@semapps/mime-types';

const { ServiceSchemaError } = require('moleculer').Errors;

class LdpAdapter {
  constructor({ resourceService = 'ldp.resource', containerService = 'ldp.container' } = {}) {
    // @ts-expect-error TS(2339): Property 'resourceService' does not exist on type ... Remove this comment to see the full error message
    this.resourceService = resourceService;
    // @ts-expect-error TS(2339): Property 'containerService' does not exist on type... Remove this comment to see the full error message
    this.containerService = containerService;
  }

  init(broker: any, service: any) {
    // @ts-expect-error TS(2339): Property 'broker' does not exist on type 'LdpAdapt... Remove this comment to see the full error message
    this.broker = broker;
    // @ts-expect-error TS(2339): Property 'service' does not exist on type 'LdpAdap... Remove this comment to see the full error message
    this.service = service;
  }

  async connect() {
    // @ts-expect-error TS(2339): Property 'service' does not exist on type 'LdpAdap... Remove this comment to see the full error message
    if (!this.service.schema.settings.containerUri) {
      throw new ServiceSchemaError(
        // @ts-expect-error TS(2339): Property 'service' does not exist on type 'LdpAdap... Remove this comment to see the full error message
        `Missing \`containerUri\` definition in settings of service ${this.service.schema.name}`
      );
    }

    // @ts-expect-error TS(2339): Property 'broker' does not exist on type 'LdpAdapt... Remove this comment to see the full error message
    await this.broker.waitForServices([this.resourceService, this.containerService], 120000);

    // @ts-expect-error TS(2339): Property 'service' does not exist on type 'LdpAdap... Remove this comment to see the full error message
    const { containerUri } = this.service.schema.settings;
    // @ts-expect-error TS(2339): Property 'broker' does not exist on type 'LdpAdapt... Remove this comment to see the full error message
    const exists = await this.broker.call(`${this.containerService}.exist`, { containerUri, webId: 'system' });

    if (!exists) {
      console.log(`Container ${containerUri} doesn't exist, creating it...`);
      // @ts-expect-error TS(2339): Property 'broker' does not exist on type 'LdpAdapt... Remove this comment to see the full error message
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
    // @ts-expect-error TS(2339): Property 'broker' does not exist on type 'LdpAdapt... Remove this comment to see the full error message
    return this.broker.call(`${this.containerService}.get`, {
      // @ts-expect-error TS(2339): Property 'service' does not exist on type 'LdpAdap... Remove this comment to see the full error message
      containerUri: this.service.schema.settings.containerUri,
      filters: filters.query,
      // @ts-expect-error TS(2339): Property 'service' does not exist on type 'LdpAdap... Remove this comment to see the full error message
      jsonContext: this.service.schema.settings.context,
      accept: MIME_TYPES.JSON
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
      // @ts-expect-error TS(2339): Property 'service' does not exist on type 'LdpAdap... Remove this comment to see the full error message
      _id = urlJoin(this.service.schema.settings.containerUri, _id);
    }
    // @ts-expect-error TS(2339): Property 'broker' does not exist on type 'LdpAdapt... Remove this comment to see the full error message
    return this.broker.call(`${this.resourceService}.get`, {
      resourceUri: _id,
      // @ts-expect-error TS(2339): Property 'service' does not exist on type 'LdpAdap... Remove this comment to see the full error message
      jsonContext: this.service.schema.settings.context,
      accept: MIME_TYPES.JSON
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

    // @ts-expect-error TS(2339): Property 'broker' does not exist on type 'LdpAdapt... Remove this comment to see the full error message
    return (
      this.broker
        // @ts-expect-error TS(2339): Property 'resourceService' does not exist on type ... Remove this comment to see the full error message
        .call(`${this.resourceService}.post`, {
          // @ts-expect-error TS(2339): Property 'service' does not exist on type 'LdpAdap... Remove this comment to see the full error message
          containerUri: this.service.schema.settings.containerUri,
          resource: {
            // @ts-expect-error TS(2339): Property 'service' does not exist on type 'LdpAdap... Remove this comment to see the full error message
            '@context': this.service.schema.settings.context,
            ...resource
          },
          slug,
          contentType: MIME_TYPES.JSON
        })
        .then((resourceUri: any) => {
          // @ts-expect-error TS(2339): Property 'broker' does not exist on type 'LdpAdapt... Remove this comment to see the full error message
          this.broker.call(`${this.containerService}.attach`, {
            // @ts-expect-error TS(2339): Property 'service' does not exist on type 'LdpAdap... Remove this comment to see the full error message
            containerUri: this.service.schema.settings.containerUri,
            resourceUri
          });

          return this.findById(resourceUri);
        })
    );
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
    // @ts-expect-error TS(2339): Property 'service' does not exist on type 'LdpAdap... Remove this comment to see the full error message
    if (!_id.startsWith('http')) _id = urlJoin(this.service.schema.settings.containerUri, _id);

    // @ts-expect-error TS(2339): Property 'broker' does not exist on type 'LdpAdapt... Remove this comment to see the full error message
    return (
      this.broker
        // @ts-expect-error TS(2339): Property 'resourceService' does not exist on type ... Remove this comment to see the full error message
        .call(`${this.resourceService}.put`, {
          resource: {
            // @ts-expect-error TS(2339): Property 'service' does not exist on type 'LdpAdap... Remove this comment to see the full error message
            '@context': this.service.schema.settings.context,
            '@id': _id,
            ...resource
          },
          contentType: MIME_TYPES.JSON
        })
        .then((resourceUri: any) => this.findById(resourceUri))
    );
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
    // @ts-expect-error TS(2339): Property 'broker' does not exist on type 'LdpAdapt... Remove this comment to see the full error message
    return (
      this.broker
        // @ts-expect-error TS(2339): Property 'resourceService' does not exist on type ... Remove this comment to see the full error message
        .call(`${this.resourceService}.delete`, {
          resourceUri: _id
        })
        .then(() => {
          // We must return the number of deleted resource
          // Otherwise the DB adapter returns an error
          return 1;
        })
    );
  }

  /**
   * Clear all entities from the container
   */
  clear() {
    // @ts-expect-error TS(2339): Property 'broker' does not exist on type 'LdpAdapt... Remove this comment to see the full error message
    return this.broker.call(`${this.containerService}.clear`, {
      // @ts-expect-error TS(2339): Property 'service' does not exist on type 'LdpAdap... Remove this comment to see the full error message
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
