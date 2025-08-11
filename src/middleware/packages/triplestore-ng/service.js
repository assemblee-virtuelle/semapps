const { SparqlJsonParser } = require('sparqljson-parse');
const SparqlGenerator = require('sparqljs').Generator;
const { MoleculerError } = require('moleculer').Errors;
const fetch = require('node-fetch');
const { throw403, throw500 } = require('@semapps/middlewares');
const countTriplesOfSubject = require('./actions/countTriplesOfSubject');
const deleteOrphanBlankNodes = require('./actions/deleteOrphanBlankNodes');
const dropAll = require('./actions/dropAll');
const insert = require('./actions/insert');
const query = require('./actions/query');
const update = require('./actions/update');
const tripleExist = require('./actions/tripleExist');
const DatasetService = require('./subservices/dataset');
const ng = require('nextgraph');

const TripleStoreService = {
  name: 'triplestore',
  settings: {
    url: null,
    user: null,
    password: null,
    mainDataset: null,
    // Sub-services customization
    dataset: {}
  },
  dependencies: ['jsonld.parser'],
  async created() {
    const { nextgraphConfig, nextgraphAdminUserId, nextgraphMappingsNuri } = this.settings;
    if (!nextgraphConfig) {
      throw new Error('NextGraph config is missing');
    }
    // this.nextgraphConfig = nextgraphConfig;
    if (!nextgraphAdminUserId) {
      throw new Error('NextGraph admin user id is missing');
    }
    // this.nextgraphAdminUserId = nextgraphAdminUserId;
    if (!nextgraphMappingsNuri) {
      throw new Error('NextGraph mappings nuri is missing');
    }
    // this.nextgraphMappingsNuri = nextgraphMappingsNuri;

    this.subservices = {};
    await ng.init_headless(nextgraphConfig);
    try {
      let session = await ng.session_headless_start(nextgraphAdminUserId);
      this.adminSessionid = session.session_id;
    } catch (err) {
      this.logger.error('Error initializing NextGraph admin session', err);
      throw err;
    }

    this.subservices.dataset = this.broker.createService({
      mixins: [DatasetService],
      settings: {
        nextgraphAdminUserId,
        nextgraphMappingsNuri,
        nextgraphConfig,
        adminSessionid: this.adminSessionid,
        ...this.settings.dataset
      }
    });
  },
  started() {
    this.sparqlJsonParser = new SparqlJsonParser();
    this.sparqlGenerator = new SparqlGenerator({
      /* prefixes, baseIRI, factory, sparqlStar */
    });
  },
  stopped() {
    ng.session_headless_stop(this.adminSessionid, true);
  },
  actions: {
    insert,
    update,
    query,
    dropAll,
    countTriplesOfSubject,
    tripleExist,
    deleteOrphanBlankNodes
  },
  methods: {
    async fetch(url, { method = 'POST', body, headers }) {
      const response = await fetch(url, {
        method,
        body,
        headers: {
          ...headers,
          Authorization: `Basic ${Buffer.from(`${this.settings.user}:${this.settings.password}`).toString('base64')}`
        }
      });

      if (!response.ok) {
        const text = await response.text();
        if (response.status === 403) {
          throw403(text);
        } else {
          // the 3 lines below (until the else) can be removed once we switch to jena-fuseki version 4.0.0 or above
          if (response.status === 500 && text.includes('permissions violation')) {
            throw403(text);
          } else {
            throw500(`Unable to reach SPARQL endpoint ${url}. Error message: ${response.statusText}. Query: ${body}`);
          }
        }
      }

      return response;
    },
    generateSparqlQuery(query) {
      try {
        return this.sparqlGenerator.stringify(query);
      } catch (e) {
        console.error(e);
        throw new MoleculerError(`Invalid SPARQL.js object: ${JSON.stringify(query)}`, 400, 'BAD_REQUEST');
      }
    }
  }
};

module.exports = TripleStoreService;
