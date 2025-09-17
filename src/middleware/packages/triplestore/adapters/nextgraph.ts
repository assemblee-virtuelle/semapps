import ng from 'nextgraph';
import { SparqlJsonParser } from 'sparqljson-parse';
import { BaseAdapter } from './base.ts';

type NextGraphAdapterSettings = {
  serverPeerId: string; // The server peer id, is provided in the console of the NextGraph server
  adminUserKey: string; // The admin user key, can be retrieved using the GUI of the NextGraph server
  clientPeerKey: string; // TODO : remember how to retrieve/generate/guess/invoke/create out of thin air the client peer key ^^
  serverAddr: string; // The server address, can be retrieved using the console of the NextGraph server
  adminUserId: string; // The admin user id, must be saved when first creating the user
  mappingsNuri: string; // The mappings nuri, must be saved when first creating the document
};

export default class NextGraphAdapter extends BaseAdapter {
  name = 'nextgraph';

  private settings: NextGraphAdapterSettings;

  private adminSessionid: string = '';

  private nextgraphConfig: { server_peer_id: string, admin_user_key: string, client_peer_key: string, server_addr: string } = {
    server_peer_id: '',
    admin_user_key: '',
    client_peer_key: '',
    server_addr: ''
  };

  private sparqlJsonParser: SparqlJsonParser;

  constructor(settings: NextGraphAdapterSettings) {
    super();
    if (!settings.serverPeerId) throw new Error('Server peer id is required');
    if (!settings.adminUserKey) throw new Error('Admin user key is required');
    if (!settings.clientPeerKey) throw new Error('Client peer key is required');
    if (!settings.serverAddr) throw new Error('Server address is required');
    if (!settings.adminUserId) throw new Error('Admin user id is required');
    if (!settings.mappingsNuri) throw new Error('Mappings nuri is required');

    this.settings = settings;
    this.sparqlJsonParser = new SparqlJsonParser();
  }

  async init(initSettings: { broker: any }) {
    // The broker is used to call the jsonld.parser service in the query method
    // TODO : see if it's an issue (can cause circular dependency or other calamities)
    this.broker = initSettings.broker;

    // Initialize the nextgraph config, used to initialize the nextgraph backend and to create users
    this.nextgraphConfig = {
      server_peer_id: this.settings.serverPeerId,
      admin_user_key: this.settings.adminUserKey,
      client_peer_key: this.settings.clientPeerKey,
      server_addr: this.settings.serverAddr
    };

    try {
      // Initialize the nextgraph backend in headless mode
      await ng.init_headless(this.nextgraphConfig);
      // Start a session for the admin user (used to manage datasets)
      const session = await ng.session_headless_start(this.settings.adminUserId);
      this.adminSessionid = session.session_id;
      this.getLogger().info(`NextGraph adapter initialized. Admin session started with id: ${this.adminSessionid}`);
    } catch (error) {
      throw new Error(`NextGraph adapter initialization failed: ${error}`);
    }
  }

  async query(dataset: string, query: string) {
    let session;
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
          return this.sparqlJsonParser.parseJsonResults(result);
        case 'CONSTRUCT':
          // TODO : check if calling a service inside another service can cause circular dependency or other calamities
          return await this.broker.call('jsonld.parser.fromQuads', { input: result });
        default:
          throw new Error('SPARQL Verb not supported');
      }
    } catch (error) {
      throw new Error(`NextGraph query failed: ${error}\nQuery: ${query}\nDataset: ${dataset}`);
    }
    finally {
      this.closeSession(session);
    }
  }

  async update(dataset: any, query: string) {
    let session;
    try {
      session = await this.openSession(dataset);
      await ng.sparql_update(session.session_id, query);
    } catch (error) {
      throw new Error(`NextGraph update failed: ${error}\nQuery: ${query}\nDataset: ${dataset}`);
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
      this.getLogger().info(`NextGraph user created for dataset ${dataset} with user id : ${userId}`);

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
      this.getLogger().info(`Mapping created for dataset ${dataset} with mapping uri : ${mappingUri}`);

    } catch (error) {
      throw new Error(`NextGraph createDataset failed: ${error}\nDataset: ${dataset}`);
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
    } catch (error) {
      throw new Error(`NextGraph datasetExists failed: ${error}\nDataset: ${dataset}`);
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
      throw new Error(`NextGraph listDatasets failed: ${error}`);
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
        this.getLogger().warn(`No nextgraph mapping found for dataset: ${dataset}`);
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
      this.getLogger().info(`Successfully deleted mapping for dataset: ${dataset} (userId: ${userId})`);

      // TODO : See with Niko about user deletion in nextgraph then if possible delete the actual user
    } catch (error) {
      throw new Error(`NextGraph deleteDataset failed: ${error}\nDataset: ${dataset}`);
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
      throw new Error(`NextGraph openSession failed: ${error}`);
    }
  }

  async closeSession(session: any) {
    try {
      await ng.session_headless_stop(session.session_id, true);
    } catch (error) {
      throw new Error(`NextGraph closeSession failed: ${error}`);
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
      throw new Error(`No user id found in the nextgraph mappings.`);
    } catch (error) {
      throw new Error(`NextGraph getUserIdForDataset failed: ${error}\nDataset: ${dataset}`);
    }
  }

  async cleanup() {
    if (this.adminSessionid) {
      try {
        await ng.session_headless_stop(this.adminSessionid, true);
        this.getLogger().info('NextGraph adapter cleaned up');
      } catch (error) {
        throw new Error(`NextGraph cleanup failed: ${error}`);
      }
    }
  }
} 