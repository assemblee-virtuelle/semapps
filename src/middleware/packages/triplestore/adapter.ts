/* eslint-disable class-methods-use-this */
import { MIME_TYPES } from '@semapps/mime-types';

// @ts-expect-error TS(7016): Could not find a declaration file for module 'uuid... Remove this comment to see the full error message
import { v4 as uuidv4 } from 'uuid';
import { frame } from 'jsonld';
import { sanitizeSparqlUri, sanitizeSparqlString } from './utils.ts';

class TripleStoreAdapter {
  constructor({ type, dataset, baseUri, ontology = 'http://semapps.org/ns/core#' }: any) {
    // @ts-expect-error TS(2339): Property 'type' does not exist on type 'TripleStor... Remove this comment to see the full error message
    this.type = type;
    // @ts-expect-error TS(2339): Property 'baseUri' does not exist on type 'TripleS... Remove this comment to see the full error message
    this.baseUri = baseUri || `urn:${type}:`;
    // @ts-expect-error TS(2339): Property 'dataset' does not exist on type 'TripleS... Remove this comment to see the full error message
    this.dataset = dataset;
    // @ts-expect-error TS(2339): Property 'ontology' does not exist on type 'Triple... Remove this comment to see the full error message
    this.ontology = ontology;
  }

  init(broker: any, service: any) {
    // @ts-expect-error TS(2339): Property 'broker' does not exist on type 'TripleSt... Remove this comment to see the full error message
    this.broker = broker;
    // @ts-expect-error TS(2339): Property 'service' does not exist on type 'TripleS... Remove this comment to see the full error message
    this.service = service;
  }

  async connect() {
    // @ts-expect-error TS(2339): Property 'broker' does not exist on type 'TripleSt... Remove this comment to see the full error message
    await this.broker.waitForServices(['triplestore'], 120000);

    // @ts-expect-error TS(2339): Property 'broker' does not exist on type 'TripleSt... Remove this comment to see the full error message
    await this.broker.call('triplestore.dataset.create', {
      // @ts-expect-error TS(2339): Property 'dataset' does not exist on type 'TripleS... Remove this comment to see the full error message
      dataset: this.dataset,
      secure: false // TODO Remove when we switch to Fuseki 5
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
  find(params: any) {
    const { query } = params;

    // Ensure that the value does not contain SPARQL injection
    if (query) Object.values(query).forEach(value => sanitizeSparqlString(value));

    // @ts-expect-error TS(2339): Property 'broker' does not exist on type 'TripleSt... Remove this comment to see the full error message
    return this.broker
      .call('triplestore.query', {
        query: `
          CONSTRUCT {
            ?s ?p ?o
          }
          WHERE {
            // @ts-expect-error TS(2339): Property 'ontology' does not exist on type 'Triple... Remove this comment to see the full error message
            ?s a <${this.ontology + this.type}> .
            ?s ?p ?o .
            ${
              query
                ? Object.keys(query)
                    // @ts-expect-error TS(2339): Property 'ontology' does not exist on type 'Triple... Remove this comment to see the full error message
                    .map(predicate => `?s <${this.ontology + predicate}> "${query[predicate]}"`)
                    .join(' . ')
                : ''
            }
          }
        `,
        // @ts-expect-error TS(2339): Property 'dataset' does not exist on type 'TripleS... Remove this comment to see the full error message
        dataset: this.dataset
      })
      .then((result: any) => {
        return frame(result, {
          // @ts-expect-error TS(2339): Property 'ontology' does not exist on type 'Triple... Remove this comment to see the full error message
          '@context': { '@vocab': this.ontology }
        });
      })
      .then((result: any) => {
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
  findOne(query: any) {
    throw new Error('Method not implemented');
  }

  /**
   * Find an entity by ID.
   */
  findById(_id: any) {
    // @ts-expect-error TS(2339): Property 'broker' does not exist on type 'TripleSt... Remove this comment to see the full error message
    return this.broker
      .call('triplestore.query', {
        query: `
          CONSTRUCT
          WHERE {
            <${sanitizeSparqlUri(_id)}> ?p ?o .
          }
        `,
        // @ts-expect-error TS(2339): Property 'dataset' does not exist on type 'TripleS... Remove this comment to see the full error message
        dataset: this.dataset
      })
      .then((result: any) => {
        return frame(result, {
          // @ts-expect-error TS(2339): Property 'ontology' does not exist on type 'Triple... Remove this comment to see the full error message
          '@context': { '@vocab': this.ontology },
          '@id': _id
        });
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
    return this.find(filters).then((result: any) => result.length);
  }

  /**
   * Insert an entity
   */
  insert(entity: any) {
    const { slug, ...resource } = entity;
    // @ts-expect-error TS(2339): Property 'baseUri' does not exist on type 'TripleS... Remove this comment to see the full error message
    resource['@id'] = this.baseUri + (slug || uuidv4());

    // Ensure no predicates include an ontology
    const keyWithOntology = Object.keys(resource).find(key => key.includes(':'));
    if (keyWithOntology)
      // @ts-expect-error TS(2339): Property 'type' does not exist on type 'TripleStor... Remove this comment to see the full error message
      throw new Error(`Cannot create a ${this.type} with key ${keyWithOntology} (no ontology allowed)`);

    // @ts-expect-error TS(2339): Property 'broker' does not exist on type 'TripleSt... Remove this comment to see the full error message
    return this.broker
      .call('triplestore.insert', {
        resource: {
          // @ts-expect-error TS(2339): Property 'ontology' does not exist on type 'Triple... Remove this comment to see the full error message
          '@context': { '@vocab': this.ontology },
          // @ts-expect-error TS(2339): Property 'type' does not exist on type 'TripleStor... Remove this comment to see the full error message
          '@type': this.type,
          ...resource
        },
        // @ts-expect-error TS(2339): Property 'dataset' does not exist on type 'TripleS... Remove this comment to see the full error message
        dataset: this.dataset
      })
      .then(() => this.findById(resource['@id']));
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
    let { id, '@id': arobaseId, ...newData } = update.$set;

    // Check ID and transform it to URI if necessary
    _id = _id || id || arobaseId;
    if (!_id) throw new Error('An ID must be specified to update resources');

    return this.findById(_id)
      .then((oldData: any) => {
        newData = { ...oldData, ...newData };
        // @ts-expect-error TS(2339): Property 'broker' does not exist on type 'TripleSt... Remove this comment to see the full error message
        return this.broker.call('triplestore.update', {
          query: `
            DELETE {
              <${sanitizeSparqlUri(_id)}> ?p ?o .
            }
            INSERT {
              // @ts-expect-error TS(2339): Property 'ontology' does not exist on type 'Triple... Remove this comment to see the full error message
              <${sanitizeSparqlUri(_id)}> a <${this.ontology + this.type}> .
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
                          // @ts-expect-error TS(2339): Property 'ontology' does not exist on type 'Triple... Remove this comment to see the full error message
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
          // @ts-expect-error TS(2339): Property 'dataset' does not exist on type 'TripleS... Remove this comment to see the full error message
          dataset: this.dataset
        });
      })
      .then(() => newData);
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
    // @ts-expect-error TS(2339): Property 'broker' does not exist on type 'TripleSt... Remove this comment to see the full error message
    return this.broker
      .call('triplestore.update', {
        query: `DELETE WHERE { <${_id}> ?p ?o . }`,
        // @ts-expect-error TS(2339): Property 'dataset' does not exist on type 'TripleS... Remove this comment to see the full error message
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

export default TripleStoreAdapter;
