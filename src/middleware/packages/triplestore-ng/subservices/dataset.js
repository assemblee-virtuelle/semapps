const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const urlJoin = require('url-join');
const format = require('string-template');
const ng = require('nextgraph');

const delay = t => new Promise(resolve => setTimeout(resolve, t));

/** @type {import('moleculer').ServiceSchema} */
const DatasetService = {
  name: 'triplestore.dataset',
  settings: {
    url: null,
    user: null,
    password: null
  },
  // started() {
  //   this.headers = {
  //     Authorization: `Basic ${Buffer.from(`${this.settings.user}:${this.settings.password}`).toString('base64')}`
  //   };
  // },
  async created() {
    const { nextgraphAdminUserId, nextgraphMappingsNuri, nextgraphConfig, adminSessionid } = this.settings;
    if (!nextgraphConfig) {
      throw new Error('NextGraph config is missing');
    }
    this.nextgraphConfig = nextgraphConfig;
    if (!adminSessionid) {
      throw new Error('NextGraph admin session id is missing');
    }
    this.adminSessionid = adminSessionid;
    if (!nextgraphAdminUserId) {
      throw new Error('NextGraph admin user id is missing');
    }
    this.nextgraphAdminUserId = nextgraphAdminUserId;
    if (!nextgraphMappingsNuri) {
      throw new Error('NextGraph mappings nuri is missing');
    }
    this.nextgraphMappingsNuri = nextgraphMappingsNuri;
  },
  actions: {
    // TODO: Implement backup if possible
    async backup(ctx) {
      this.logger.info('Backup not implemented yet');
      throw new Error('Backup not implemented yet');
    },
    async create(ctx) {
      const { dataset } = ctx.params;
      if (!dataset) throw new Error('Unable to create dataset. The parameter dataset is missing');
      const exist = await this.actions.exist({ dataset }, { parentCtx: ctx });
      // TODO: remove this after implementing the exist action
      // const exist = false;
      if (!exist) {
        this.logger.info(`Dataset ${dataset} doesn't exist. Creating it...`);
        let userId = await ng.admin_create_user(this.nextgraphConfig);
        this.logger.info(`NextGraph user created for dataset ${dataset} with user id : ${userId}`);
        // await ng.sparql_update(this.admin_session_id, `INSERT DATA { GRAPH <${this.nextgraphMappingsNuri}> { <http://example.com/testWithLaurinUsingNamedGraph> <http://toto.com/totoNuri> <http://toto.fr/totoSylvain> } }`);
        // Store the mapping
        const mappingUri = `http://semapps.org/mappings/${encodeURIComponent(dataset)}`;

        await ng.sparql_update(
          this.adminSessionid,
          `
          PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
          INSERT DATA { 
            GRAPH <${this.nextgraphMappingsNuri}> { 
              <${mappingUri}> 
                a skos:Concept ;
                skos:prefLabel "${dataset}" ;
                skos:notation "${userId}" .
            } 
          }
        `
        );
        this.logger.info(`Mapping created for dataset ${dataset} with mapping uri : ${mappingUri}`);
      }
    },
    async exist(ctx) {
      const { dataset } = ctx.params;
      if (!dataset) {
        throw new Error('Unable to check if dataset exists. The parameter dataset is missing');
      }
      try {
        const response = await ng.sparql_query(
          this.adminSessionid,
          `
          PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
          SELECT ?userId WHERE {
            GRAPH <${this.nextgraphMappingsNuri}> {
              ?mapping a skos:Concept ;
                skos:prefLabel "${dataset}" ;
                skos:notation ?userId .
            }
          }
        `
        );
        if (!response.results.bindings.length > 0) {
          this.logger.info(`Dataset ${dataset} is not mapped`);
          return false;
        }
        const userId = response.results.bindings[0].userId.value;
        this.logger.info(`Dataset ${dataset} is mapped with user id : ${userId}`);

        // try to open a session with the user id to check if the user actually exists
        // try {
        //   const session = await ng.session_headless_start(userId);
        //   if (!session) {
        //     this.logger.info(`Failed to open a session with the user id : ${userId}`);
        //     return false;
        //   }
        // // TODO: debug why with the following line all the tests pass but the suite is still failing with a SessionNotFound error
        // // ng.session_headless_stop(session.session_id, true);
        //   this.logger.info(`Session opened and closed with the user id : ${userId}`);
        // } catch (error) {
        //   this.logger.info(`Failed to open a session with the user id : ${userId}`);
        //   return false;
        // }
        return true;
      } catch (error) {
        this.logger.error(`Error checking if dataset ${dataset} exists:`, error);
        return false;
      }
    },
    async list() {
      try {
        // Query all mapped datasets from your mappings graph
        const response = await ng.sparql_query(
          this.adminSessionid,
          `
          PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
          
          SELECT ?datasetName WHERE {
            GRAPH <${this.nextgraphMappingsNuri}> {
              ?mapping a skos:Concept ;
                skos:prefLabel ?datasetName ;
                skos:notation ?userId .
            }
          }
        `
        );

        if (response && response.results && response.results.bindings) {
          // Extract dataset names from the query results
          return response.results.bindings.map(binding => binding.datasetName.value);
        }

        return [];
      } catch (error) {
        this.logger.error('Error listing mapped datasets:', error);
        return [];
      }
    },
    async waitForCreation(ctx) {
      const { dataset } = ctx.params;
      let datasetExist;
      do {
        await delay(1000);
        datasetExist = await this.actions.exist({ dataset }, { parentCtx: ctx });
      } while (!datasetExist);
    },
    async getUserId(ctx) {
      const { dataset } = ctx.params;
      if (!dataset) {
        throw new Error('Unable to get user id. The parameter dataset is missing');
      }
      const result = await ng.sparql_query(
        this.adminSessionid,
        `
        PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
        SELECT ?userId WHERE {
          GRAPH <${this.nextgraphMappingsNuri}> {
            ?mapping a skos:Concept ;
              skos:prefLabel "${dataset}" ;
              skos:notation ?userId .
          }
        }
      `
      );
      return result.results.bindings[0].userId.value;
    },
    async openSession(ctx) {
      const { dataset } = ctx.params;
      if (!dataset) {
        throw new Error('Unable to open session. The parameter dataset is missing');
      }
      const userId = await this.actions.getUserId({ dataset }, { parentCtx: ctx });
      const session = await ng.session_headless_start(userId);
      return session;
    },
    async closeSession(ctx) {
      const { sessionId } = ctx.params;
      if (!sessionId) {
        throw new Error('Unable to close session. The parameter sessionId is missing');
      }
      ng.session_headless_stop(sessionId, true);
    },
    delete: {
      params: {
        dataset: { type: 'string' },
        iKnowWhatImDoing: { type: 'boolean' }
      },
      async handler(ctx) {
        const { dataset, iKnowWhatImDoing } = ctx.params;

        if (!iKnowWhatImDoing) {
          throw new Error('Please confirm that you know what you are doing by setting `iKnowWhatImDoing` to `true`.');
        }

        if (!dataset) {
          throw new Error('Unable to delete mapping. The parameter dataset is missing');
        }

        try {
          // First, check if the mapping exists
          const checkResponse = await ng.sparql_query(
            this.adminSessionid,
            `
            PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
            
            SELECT ?mapping ?userId WHERE {
              GRAPH <${this.nextgraphMappingsNuri}> {
                ?mapping a skos:Concept ;
                  skos:prefLabel "${dataset}" ;
                  skos:notation ?userId .
              }
            }
          `
          );

          if (!checkResponse.results.bindings.length > 0) {
            this.logger.warn(`No mapping found for dataset: ${dataset}`);
            return; // Nothing to delete
          }

          const mappingUri = checkResponse.results.bindings[0].mapping.value;
          const userId = checkResponse.results.bindings[0].userId.value;

          // Delete the mapping from the graph
          await ng.sparql_update(
            this.adminSessionid,
            `
            PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
            
            DELETE DATA { 
              GRAPH <${this.nextgraphMappingsNuri}> { 
                <${mappingUri}> 
                  a skos:Concept ;
                  skos:prefLabel "${dataset}" ;
                  skos:notation "${userId}" .
              } 
            }
          `
          );

          this.logger.info(`Successfully deleted mapping for dataset: ${dataset} (userId: ${userId})`);

          // TODO : See with Niko about user deletion in nextgraph then if possible delete the actual user
        } catch (error) {
          this.logger.error(`Failed to delete mapping for dataset ${dataset}:`, error);
          throw new Error(`Failed to delete mapping for dataset ${dataset}: ${error.message}`);
        }
      }
    }
  }
};

module.exports = DatasetService;
