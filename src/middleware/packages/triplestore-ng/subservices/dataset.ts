import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import urlJoin from 'url-join';
// @ts-expect-error TS(7016): Could not find a declaration file for module 'stri... Remove this comment to see the full error message
import format from 'string-template';
import { ServiceSchema, defineAction } from 'moleculer';
import { fileURLToPath } from 'url';
import ng from 'nextgraph';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const delay = (t: any) => new Promise(resolve => setTimeout(resolve, t));

const DatasetService = {
  name: 'triplestore.dataset' as const,
  settings: {
    url: null,
    user: null,
    password: null,
    nextgraphConfig: null,
    nextgraphAdminUserId: null,
    nextgraphMappingsNuri: null,
    adminSessionid: null
  },
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
    backup: defineAction({
      async handler(ctx) {
        this.logger.info('Backup not implemented yet');
        throw new Error('Backup not implemented yet');
      }
    }),

    create: defineAction({
      async handler(ctx) {
        const { dataset } = ctx.params;
        if (!dataset) throw new Error('Unable to create dataset. The parameter dataset is missing');
        const exist = await this.actions.exist({ dataset }, { parentCtx: ctx });
        if (!exist) {
          this.logger.info(`Dataset ${dataset} doesn't exist. Creating it...`);
          let userId = await ng.admin_create_user(this.nextgraphConfig);
          this.logger.info(`NextGraph user created for dataset ${dataset} with user id : ${userId}`);
          
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
      }
    }),

    exist: defineAction({
      async handler(ctx) {
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
          return true;
        } catch (error) {
          this.logger.error(`Error checking if dataset ${dataset} exists:`, error);
          return false;
        }
      }
    }),

    list: defineAction({
      async handler() {
        try {
          const response = await ng.sparql_query(
            this.adminSessionid,
            `
            PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
            SELECT ?datasetName WHERE {
              GRAPH <${this.nextgraphMappingsNuri}> {
                ?mapping a skos:Concept ;
                  skos:prefLabel ?datasetName .
              }
            }
          `
          );
          return response.results.bindings.map((binding: any) => binding.datasetName.value);
        } catch (error) {
          this.logger.error('Error listing datasets:', error);
          return [];
        }
      }
    }),

    isSecure: defineAction({
      async handler(ctx) {
        return false;
      }
    }),

    delete: defineAction({
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

          if (!(checkResponse.results.bindings.length > 0)) {
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
    }),

    waitForCreation: defineAction({
      async handler(ctx) {
        const { dataset } = ctx.params;
        let exist = false;
        let attempts = 0;
        const maxAttempts = 10;

        while (!exist && attempts < maxAttempts) {
          await delay(1000);
          exist = await this.actions.exist({ dataset }, { parentCtx: ctx });
          attempts++;
        }

        if (!exist) {
          throw new Error(`Dataset ${dataset} was not created after ${maxAttempts} attempts`);
        }
      }
    }),

    getUserId: defineAction({
      async handler(ctx) {
        const { dataset } = ctx.params;
        if (!dataset) {
          throw new Error('Unable to get user id. The parameter dataset is missing');
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
          if (response.results.bindings.length > 0) {
            return response.results.bindings[0].userId.value;
          }
          throw new Error(`No user id found for dataset ${dataset}`);
        } catch (error) {
          this.logger.error(`Error getting user id for dataset ${dataset}:`, error);
          throw error;
        }
      }
    }),

    openSession: defineAction({
      async handler(ctx) {
        const { dataset } = ctx.params;
        if (!dataset) {
          throw new Error('Unable to open session. The parameter dataset is missing');
        }
        try {
          const userId = await this.actions.getUserId({ dataset }, { parentCtx: ctx });
          const session = await ng.session_headless_start(userId);
          return session;
        } catch (error) {
          this.logger.error(`Error opening session for dataset ${dataset}:`, error);
          throw error;
        }
      }
    }),

    closeSession: defineAction({
      async handler(ctx) {
        const { sessionId } = ctx.params;
        if (!sessionId) {
          throw new Error('Unable to close session. The parameter sessionId is missing');
        }
        try {
          await ng.session_headless_stop(sessionId, true);
        } catch (error) {
          this.logger.error(`Error closing session ${sessionId}:`, error);
          throw error;
        }
      }
    })
  }
} satisfies ServiceSchema;

export default DatasetService;

declare module 'moleculer' {
  interface ServiceName {
    [DatasetService.name]: typeof DatasetService;
  }
} 