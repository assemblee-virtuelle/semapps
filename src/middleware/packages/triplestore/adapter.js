/* eslint-disable class-methods-use-this */
const { MIME_TYPES } = require('@semapps/mime-types');
const { v4: uuidv4 } = require('uuid');
const { frame } = require('jsonld');

class TripleStoreAdapter {
  constructor({ type, dataset, baseUri, ontology = 'http://semapps.org/ns/core#' }) {
    this.type = type;
    this.baseUri = baseUri || `urn:${type}:`;
    this.dataset = dataset;
    this.ontology = ontology;
  }

  init(broker, service) {
    this.broker = broker;
    this.service = service;
  }

  async connect() {
    await this.broker.waitForServices(['triplestore'], 120000);

    await this.broker.call('triplestore.dataset.create', {
      dataset: this.dataset,
      secure: false
    });
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
  find(params) {
    const { query } = params;
    return this.broker
      .call('triplestore.query', {
        query: `
          CONSTRUCT {
            ?s ?p ?o
          }
          WHERE {
            ?s a <${this.ontology + this.type}> .
            ?s ?p ?o .
            ${
              query
                ? Object.keys(query)
                    .map(predicate => `?s <${this.ontology + predicate}> "${query[predicate]}"`)
                    .join(' . ')
                : ''
            }
          }
        `,
        accept: MIME_TYPES.JSON,
        dataset: this.dataset
      })
      .then(result => {
        return frame(result, {
          '@context': { '@vocab': this.ontology }
        });
      })
      .then(result => {
        if (result['@graph']) {
          // Several results
          return result['@graph'];
        }
        if (result['@id']) {
          // Single result
          return [result];
        }
        // No result
        return [];
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
    return this.broker
      .call('triplestore.query', {
        query: `
          CONSTRUCT
          WHERE {
            <${_id}> ?p ?o .
          }
        `,
        accept: MIME_TYPES.JSON,
        dataset: this.dataset
      })
      .then(result => {
        return frame(result, {
          '@context': { '@vocab': this.ontology },
          '@id': _id
        });
      });
  }

  /**
   * Find all entities by IDs
   */
  findByIds(ids) {
    return Promise.all(ids.map(id => this.findById(id)));
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
    return this.find(filters).then(result => result.length);
  }

  /**
   * Insert an entity
   */
  insert(entity) {
    const { slug, ...resource } = entity;
    resource['@id'] = this.baseUri + (slug || uuidv4());

    // Ensure no predicates include an ontology
    const keyWithOntology = Object.keys(resource).find(key => key.includes(':'));
    if (keyWithOntology)
      throw new Error(`Cannot create a ${this.type} with key ${keyWithOntology} (no ontology allowed)`);

    return this.broker
      .call('triplestore.insert', {
        resource: {
          '@context': { '@vocab': this.ontology },
          '@type': this.type,
          ...resource
        },
        contentType: MIME_TYPES.JSON,
        dataset: this.dataset
      })
      .then(() => this.findById(resource['@id']));
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
    let { id, '@id': arobaseId, ...newData } = update.$set;

    // Check ID and transform it to URI if necessary
    _id = _id || id || arobaseId;
    if (!_id) throw new Error('An ID must be specified to update resources');

    return this.findById(_id)
      .then(oldData => {
        newData = { ...oldData, ...newData };
        return this.broker.call('triplestore.update', {
          query: `
            DELETE {
              <${_id}> ?p ?o .
            }
            INSERT {
              <${_id}> a <${this.ontology + this.type}> .
              ${
                newData
                  ? Object.keys(newData)
                      .filter(predicate => {
                        if (!newData[predicate]) return false;
                        if (Array.isArray(newData[predicate]) && newData[predicate].length === 0) return false;
                        if (['@id', '@type', '@context'].includes(predicate)) return false;
                        return true;
                      })
                      .map(
                        predicate =>
                          `<${_id}> <${this.ontology + predicate}> ${
                            Array.isArray(newData[predicate])
                              ? newData[predicate].map(o => `"${o}"`).join(', ')
                              : `"${newData[predicate]}"`
                          }`
                      )
                      .join(' . ')
                  : ''
              }
            }
            WHERE {
              <${_id}> ?p ?o .
            }
          `,
          contentType: MIME_TYPES.JSON,
          dataset: this.dataset
        });
      })
      .then(() => newData);
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
      .call('triplestore.update', {
        query: `DELETE WHERE { <${_id}> ?p ?o . }`,
        dataset: this.dataset
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
    // return this.broker.call(this.containerService + '.clear', {
    //   containerUri: this.service.schema.settings.containerUri
    // });
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
