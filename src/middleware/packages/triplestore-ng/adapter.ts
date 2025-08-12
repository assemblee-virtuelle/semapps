/* eslint-disable class-methods-use-this */
import { MIME_TYPES } from '@semapps/mime-types';
// @ts-expect-error TS(7016): Could not find a declaration file for module 'uuid... Remove this comment to see the full error message
import { v4 as uuidv4 } from 'uuid';
import { frame } from 'jsonld';
import { sanitizeSparqlUri, sanitizeSparqlString } from './utils.ts';

class TripleStoreAdapter {
  private type: any;

  private baseUri: any;

  private dataset: any;

  private ontology: any;

  private broker: any;

  private service: any;

  constructor({ type, dataset, baseUri, ontology = 'http://semapps.org/ns/core#' }: any) {
    this.type = type;
    this.baseUri = baseUri || `urn:${type}:`;
    this.dataset = dataset;
    this.ontology = ontology;
  }

  init(broker: any, service: any) {
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
  find(params: any) {
    const { query } = params;

    // Ensure that the value does not contain SPARQL injection
    if (query) Object.values(query).forEach((value: any) => sanitizeSparqlString(value));

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
      .then((result: any) => {
        return frame(result, {
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
    return this.broker
      .call('triplestore.query', {
        query: `
          CONSTRUCT {
            ?s ?p ?o
          }
          WHERE {
            <${_id}> a <${this.ontology + this.type}> .
            <${_id}> ?p ?o .
          }
        `,
        accept: MIME_TYPES.JSON,
        dataset: this.dataset
      })
      .then((result: any) => {
        return frame(result, {
          '@context': { '@vocab': this.ontology }
        });
      })
      .then((result: any) => {
        if (result['@id']) {
          return result;
        }
        return null;
      });
  }

  /**
   * Find entities by IDs.
   */
  findByIds(ids: any) {
    if (!ids || ids.length === 0) return Promise.resolve([]);

    const values = ids.map((id: any) => `<${id}>`).join(' ');

    return this.broker
      .call('triplestore.query', {
        query: `
          CONSTRUCT {
            ?s ?p ?o
          }
          WHERE {
            VALUES ?s { ${values} }
            ?s a <${this.ontology + this.type}> .
            ?s ?p ?o .
          }
        `,
        accept: MIME_TYPES.JSON,
        dataset: this.dataset
      })
      .then((result: any) => {
        return frame(result, {
          '@context': { '@vocab': this.ontology }
        });
      })
      .then((result: any) => {
        if (result['@graph']) {
          return result['@graph'];
        }
        if (result['@id']) {
          return [result];
        }
        return [];
      });
  }

  /**
   * Count entities by filters.
   */
  count(filters = {}) {
    return this.broker.call('triplestore.countTriplesOfSubject', {
      uri: this.baseUri,
      dataset: this.dataset
    });
  }

  /**
   * Insert an entity.
   */
  insert(entity: any) {
    const id = entity['@id'] || `${this.baseUri}${uuidv4()}`;

    return this.broker.call('triplestore.insert', {
      resource: {
        '@context': { '@vocab': this.ontology },
        '@id': id,
        ...entity
      },
      dataset: this.dataset
    });
  }

  /**
   * Insert many entities.
   */
  insertMany(entities: any) {
    return Promise.all(entities.map((entity: any) => this.insert(entity)));
  }

  /**
   * Update many entities by query.
   */
  updateMany(query: any, update: any) {
    throw new Error('Method not implemented');
  }

  /**
   * Update an entity by ID.
   */
  updateById(_id: any, update: any) {
    // First, remove the entity
    return this.removeById(_id)
      .then(() => {
        // Then insert the updated entity
        return this.insert({
          '@id': _id,
          ...update
        });
      });
  }

  /**
   * Remove many entities by query.
   */
  removeMany(query: any) {
    throw new Error('Method not implemented');
  }

  /**
   * Remove an entity by ID.
   */
  removeById(_id: any) {
    return this.broker.call('triplestore.update', {
      query: `
        DELETE {
          <${_id}> ?p ?o .
        }
        WHERE {
          <${_id}> ?p ?o .
        }
      `,
      dataset: this.dataset
    });
  }

  /**
   * Clear all entities.
   */
  clear() {
    return this.broker.call('triplestore.dropAll', {
      dataset: this.dataset
    });
  }

  /**
   * Convert entity to plain object.
   */
  entityToObject(entity: any) {
    return entity;
  }

  /**
   * Transform ID before saving.
   */
  beforeSaveTransformID(entity: any, idField: any) {
    return entity;
  }

  /**
   * Transform ID after retrieving.
   */
  afterRetrieveTransformID(entity: any, idField: any) {
    return entity;
  }
}

export default TripleStoreAdapter; 