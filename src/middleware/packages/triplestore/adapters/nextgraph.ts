import ng from 'nextgraph';
import { SparqlJsonParser } from 'sparqljson-parse';
import { Response } from 'node-fetch';
import { BaseAdapter } from './base.ts';


// Type declaration for nextgraph module
// declare module 'nextgraph' {
//   export function init_headless(config: any): Promise<void>;
//   export function session_headless_start(userId: string): Promise<{ session_id: string }>;
//   export function session_headless_stop(sessionId: string, force: boolean): Promise<void>;
//   export function sparql_query(sessionId: string, query: string): Promise<any>;
//   export function sparql_update(sessionId: string, query: string): Promise<void>;
//   export function admin_create_user(config: any): Promise<string>;
// }

export default class NextGraphAdapter extends BaseAdapter {
  name = 'nextgraph';

  private settings: any;

  private adminSessionid: string = '';

  private broker: any;

  private nextgraphConfig: { server_peer_id: string, admin_user_key: string, client_peer_key: string, server_addr: string } = {
    server_peer_id: '',
    admin_user_key: '',
    client_peer_key: '',
    server_addr: ''
  };

  private sparqlJsonParser: SparqlJsonParser;

  constructor() {
    super();
    this.sparqlJsonParser = new SparqlJsonParser();
  }

  setBroker(broker: any) {
    this.broker = broker;
  }

  static async create(settings: any) {
    const adapter = new NextGraphAdapter();
    await adapter.init(settings);
    return adapter;
  }

  async init(settings: any) {
    if (!settings.serverPeerId) throw new Error('Server peer id is required');
    if (!settings.adminUserKey) throw new Error('Admin user key is required');
    if (!settings.clientPeerKey) throw new Error('Client peer key is required');
    if (!settings.serverAddr) throw new Error('Server address is required');
    if (!settings.adminUserId) throw new Error('Admin user id is required');
    if (!settings.mappingsNuri) throw new Error('Mappings nuri is required');
    this.settings = settings;
    try {
      this.nextgraphConfig = {
        server_peer_id: this.settings.serverPeerId,
        admin_user_key: this.settings.adminUserKey,
        client_peer_key: this.settings.clientPeerKey,
        server_addr: this.settings.serverAddr
      };
      await ng.init_headless(this.nextgraphConfig);
      const session = await ng.session_headless_start(settings.adminUserId);
      this.adminSessionid = session.session_id;
    } catch (error) {
      throw new Error(`Failed to initialize NextGraph backend: ${error}`);
    }
  }

  async query(dataset: string, query: string) {
    let session: any;
    try {
      session = await this.openSession(dataset);
      const result = await ng.sparql_query(session.session_id, query);

      const regex = /(CONSTRUCT|SELECT|ASK).*/gm;
      // @ts-expect-error TS(2531): Object is possibly 'null'.
      const verb = regex.exec(query)[1];
      switch (verb) {
        case 'ASK':
          return result;

        case 'SELECT':
          return await this.sparqlJsonParser.parseJsonResults(result);

        case 'CONSTRUCT':
          return await this.broker.call('jsonld.parser.fromQuads', { input: result });

        default:
          throw new Error('SPARQL Verb not supported');
      }
    } catch (error) {
      throw new Error(`NextGraph query failed: ${error}`);
    }
    finally {
      this.closeSession(session);
    }
  }

  async update(dataset: any, query: string) {
    let session: any;
    try {
      session = await this.openSession(dataset);
      await ng.sparql_update(session.session_id, query);
    } catch (error) {
      throw new Error(`NextGraph update failed: ${error}\nQuery: ${query}`);
    }
    finally {
      this.closeSession(session);
    }
  }

  async dropAll(dataset: string): Promise<void> {
    let session: any;
    try {
      session = await this.openSession(dataset);
      return await ng.sparql_update(session.session_id, 'DELETE { ?s ?p ?o } WHERE { ?s ?p ?o }');
    } catch (error) {
      throw new Error(`NextGraph dropAll failed: ${error}\nDataset: ${dataset}`);
    }
    finally {
      this.closeSession(session);
    }
  }

  async createDataset(dataset: string) {
    try {
      const userId = await ng.admin_create_user(this.nextgraphConfig);
      // TODO: see about logger
      // this.logger.info(`NextGraph user created for dataset ${dataset} with user id : ${userId}`);

      const mappingUri = `http://semapps.org/mappings/${encodeURIComponent(dataset)}`;

      await ng.sparql_update(
        this.adminSessionid,
        `
        PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
        INSERT DATA { 
          GRAPH <${this.settings.mappingsNuri}> { 
            <${mappingUri}> 
              a skos:Concept ;
              skos:prefLabel "${dataset}" ;
              skos:notation "${userId}" .
          } 
        }
      `
      );
      // this.logger.info(`Mapping created for dataset ${dataset} with mapping uri : ${mappingUri}`);

    } catch (error) {
      throw new Error(`Failed to create NextGraph dataset: ${error}`);
    }
  }

  async datasetExists(dataset: string): Promise<boolean> {
    try {
      
      const response = await ng.sparql_query(
        this.adminSessionid,
        `
        PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
        SELECT ?userId WHERE {
          GRAPH <${this.settings.mappingsNuri}> {
            ?mapping a skos:Concept ;
              skos:prefLabel "${dataset}" ;
              skos:notation ?userId .
          }
        }
      `
      );
      return response && response.results && response.results.bindings && response.results.bindings.length > 0;
    } catch {
      return false;
    }
  }

  async listDatasets(): Promise<string[]> {
    try {
      const response = await ng.sparql_query(
        this.adminSessionid,
        `
        PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
        SELECT ?datasetName WHERE {
          GRAPH <${this.settings.mappingsNuri}> {
            ?mapping a skos:Concept ;
              skos:prefLabel ?datasetName .
          }
        }
      `
      );
      return response.results.bindings.map((binding: any) => binding.datasetName.value);
    } catch (error) {
      // this.logger.error('Error listing datasets:', error);
      return [];
    }
  }

  async deleteDataset(dataset: string): Promise<void> {
    try {
      // First, check if the mapping exists
      const checkResponse = await ng.sparql_query(
        this.adminSessionid,
        `
        PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
        
        SELECT ?mapping ?userId WHERE {
          GRAPH <${this.settings.mappingsNuri}> {
            ?mapping a skos:Concept ;
              skos:prefLabel "${dataset}" ;
              skos:notation ?userId .
          }
        }
      `
      );

      if (!(checkResponse.results.bindings.length > 0)) {
        // this.logger.warn(`No mapping found for dataset: ${dataset}`);
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
          GRAPH <${this.settings.mappingsNuri}> { 
            <${mappingUri}> 
              a skos:Concept ;
              skos:prefLabel "${dataset}" ;
              skos:notation "${userId}" .
          } 
        }
      `
      );

      // this.logger.info(`Successfully deleted mapping for dataset: ${dataset} (userId: ${userId})`);

      // TODO : See with Niko about user deletion in nextgraph then if possible delete the actual user
    } catch (error) {
      // this.logger.error(`Failed to delete mapping for dataset ${dataset}:`, error);
      throw new Error(`Failed to delete mapping for dataset ${dataset}: ${error.message}`);
    }
  }

  async backupDataset(dataset: string): Promise<void> {
    throw new Error('Backup not implemented for NextGraph');
  }


  async openSession(dataset: string) {
    try {
      
      const userId = await this.getUserIdForDataset(dataset);
      const session = await ng.session_headless_start(userId);
      return session;
    } catch (error) {
      throw new Error(`Failed to open NextGraph session: ${error}`);
    }
  }

  async closeSession(session: any) {
    try {
      if (session && session.session_id) {
        await ng.session_headless_stop(session.session_id, true);
      }
    } catch (error) {
      // Log error but don't throw to avoid breaking cleanup
      console.error('Failed to close NextGraph session:', error);
    }
  }

  async cleanup() {
    if (this.adminSessionid) {
      try {
        await ng.session_headless_stop(this.adminSessionid, true);
      } catch (error) {
        console.error('Failed to cleanup NextGraph admin session:', error);
      }
    }
  }

  private async getUserIdForDataset(dataset: string): Promise<string> {
    try {
      const response = await ng.sparql_query(
        this.adminSessionid,
        `
        PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
        SELECT ?userId WHERE {
          GRAPH <${this.settings.mappingsNuri}> {
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
      // this.logger.error(`Error getting user id for dataset ${dataset}:`, error);
      console.error(`Error getting user id for dataset ${dataset}:`, error);
      throw error;
    }
}
} 