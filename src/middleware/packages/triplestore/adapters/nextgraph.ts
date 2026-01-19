import ng from 'nextgraph';
import fs from 'fs';
import { join as pathJoin } from 'path';
import { SparqlJsonParser } from 'sparqljson-parse';
import { AdapterInterface, BaseAdapter } from './base.ts';

type NextGraphAdapterSettings = {
  serverPeerId: string; // The server peer id, is provided in the console of the NextGraph server
  adminUserKey: string; // The admin user key, can be retrieved using the GUI of the NextGraph server
  clientPeerKey: string; // The client peer key, can be generated usinf the CLI of the NextGraph server ex with cargo : cargo run --bin ngcli gen-key
  serverAddr: string; // The server address, can be retrieved using the console of the NextGraph server
  adminUserId: string; // The admin user id, must be saved when first creating the user
  mappingsNuri: string; // The mappings nuri, must be saved when first creating the document
  backupsPath?: string; // Path to store backups
};

type Session = {
  session_id: number;
  user: string;
  private_store_id: string;
  protected_store_id: string;
  public_store_id: string;
};

type DatasetMetadata = {
  mappingUri: string;
  userId: string;
  wacGraph: string;
};

const openSessions: { [dataset: string]: Session } = {};

export default class NextGraphAdapter extends BaseAdapter implements AdapterInterface {
  name = 'nextgraph';

  private settings: { adminUserId: string; mappingsNuri: string; backupsPath?: string };

  private adminSessionid: string = '';

  private sdkConfig: { server_peer_id: string; admin_user_key: string; client_peer_key: string; server_addr: string };

  private sparqlJsonParser: SparqlJsonParser;

  constructor(settings: NextGraphAdapterSettings) {
    super();
    if (!settings.serverPeerId) throw new Error('Server peer id is required');
    if (!settings.adminUserKey) throw new Error('Admin user key is required');
    if (!settings.clientPeerKey) throw new Error('Client peer key is required');
    if (!settings.serverAddr) throw new Error('Server address is required');
    if (!settings.adminUserId) throw new Error('Admin user id is required');
    if (!settings.mappingsNuri) throw new Error('Mappings nuri is required');

    // Create the SDK config, used to initialize the adapter and to create datasets (users)
    this.sdkConfig = {
      server_peer_id: settings.serverPeerId,
      admin_user_key: settings.adminUserKey,
      client_peer_key: settings.clientPeerKey,
      server_addr: settings.serverAddr
    };

    this.settings = {
      adminUserId: settings.adminUserId,
      mappingsNuri: settings.mappingsNuri,
      backupsPath: settings.backupsPath
    };

    this.sparqlJsonParser = new SparqlJsonParser();
  }

  async init(initSettings: { broker: any }) {
    // The broker is used to call the jsonld.parser service in the query method
    // TODO : see if it's an issue (can cause circular dependency or other calamities)
    this.broker = initSettings.broker;

    try {
      // Initialize the nextgraph backend in headless mode
      await ng.init_headless(this.sdkConfig);

      // Start a session for the admin user (used to manage datasets)
      const session = await ng.session_headless_start(this.settings.adminUserId);
      this.adminSessionid = session.session_id;

      this.getLogger().info(`NextGraph adapter initialized. Admin session started with id: ${this.adminSessionid}`);
    } catch (error) {
      throw new Error(`NextGraph adapter initialization failed: ${error}`);
    }
  }

  async query(dataset: string, query: string) {
    try {
      const session = await this.openOrGetSession(dataset);
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
  }

  async update(dataset: any, query: string) {
    try {
      const session = await this.openOrGetSession(dataset);
      await ng.sparql_update(session.session_id, query);
    } catch (error) {
      throw new Error(`NextGraph update failed: ${error}\nQuery: ${query}\nDataset: ${dataset}`);
    }
  }

  async createDataset(dataset: string) {
    try {
      // Create user

      const userId = await ng.admin_create_user(this.sdkConfig);

      this.getLogger().info(`NextGraph user created for dataset ${dataset} with user id : ${userId}`);

      // Create WAC document

      const session: Session = await ng.session_headless_start(userId);

      const protectedRepoId = session.protected_store_id.substring(2, 46);

      const wacDocumentUri = await ng.doc_create(
        session.session_id,
        'Graph',
        'data:graph',
        'store',
        'protected',
        protectedRepoId
      );

      this.getLogger().info(`NextGraph user created for dataset ${dataset} with user id : ${userId}`);

      // Store the user and WAC document IDs in mappings document

      const mappingUri = `http://semapps.org/mappings/${encodeURIComponent(dataset)}`;

      await ng.sparql_update(
        this.adminSessionid,
        `
          PREFIX semapps: <http://semapps.org/ns/core#>
          INSERT DATA { 
            GRAPH <${this.settings.mappingsNuri}> { 
              <${mappingUri}> 
                a semapps:Dataset ;
                semapps:name "${dataset}" ;
                semapps:userId "${userId}" ;
                semapps:wacGraph "${wacDocumentUri}" .
            } 
          }
        `
      );

      this.getLogger().info(`Mapping created for dataset ${dataset} with mapping uri : ${mappingUri}`);
    } catch (error) {
      throw new Error(`NextGraph createDataset failed: ${error}\nDataset: ${dataset}`);
    }
  }

  async datasetExists(dataset: string) {
    try {
      const datasetMetadata = await this.getDatasetMetadata(dataset);
      return !!datasetMetadata;
    } catch (error) {
      throw new Error(`NextGraph datasetExists failed: ${error}\nDataset: ${dataset}`);
    }
  }

  async listDatasets() {
    try {
      const response = await ng.sparql_query(
        this.adminSessionid,
        `
        PREFIX semapps: <http://semapps.org/ns/core#>
        SELECT ?datasetName WHERE {
          GRAPH <${this.settings.mappingsNuri}> {
            ?mapping a semapps:Dataset ;
            semapps:name ?datasetName .
          }
        }
      `
      );
      return response.results.bindings.map((binding: any) => binding.datasetName.value);
    } catch (error) {
      throw new Error(`NextGraph listDatasets failed: ${error}`);
    }
  }

  async deleteDataset(dataset: string) {
    try {
      const datasetMetadata = await this.getDatasetMetadata(dataset);

      if (!datasetMetadata) {
        this.getLogger().warn(`Nextgraph delete dataset : No nextgraph mapping found for dataset: ${dataset}`);
        return; // Nothing to delete
      }

      // Delete the mapping from the graph
      await ng.sparql_update(
        this.adminSessionid,
        `
          PREFIX semapps: <http://semapps.org/ns/core#>
          DELETE WHERE { 
            GRAPH <${this.settings.mappingsNuri}> { 
              <${datasetMetadata.mappingUri}> ?p ?o .
            } 
          }
        `
      );
      this.getLogger().info(`Successfully deleted mapping for dataset: ${dataset} (userId: ${datasetMetadata.userId})`);

      // TODO : See with Niko about user deletion in nextgraph then if possible delete the actual user
    } catch (error) {
      throw new Error(`NextGraph deleteDataset failed: ${error}\nDataset: ${dataset}`);
    }
  }

  async clearDataset(dataset: string) {
    try {
      const session = await this.openOrGetSession(dataset);

      // Delete all triples in all documents
      await ng.sparql_update(session.session_id, 'DELETE WHERE { GRAPH ?g { ?s ?p ?o } }');

      // TODO Delete also the documents when the method will be available
    } catch (error) {
      throw new Error(`NextGraph dropAll failed: ${error}\nDataset: ${dataset}`);
    }
  }

  async backupDataset(dataset: string) {
    try {
      if (!this.settings.backupsPath)
        throw new Error('The backupsPath setting is required in the NextGraph adapter if you want to backup data');

      fs.mkdirSync(this.settings.backupsPath, { recursive: true, mode: 0o777 });

      const session = await this.openOrGetSession(dataset);

      const dump = await ng.rdf_dump(session.session_id);

      // Add a dot at the end of each line, to have a valid N-Quads format
      const dumpWithTrailingDots = dump
        .split(/\n/)
        .map(line => `${line} .`)
        .join('\n');

      fs.writeFileSync(pathJoin(this.settings.backupsPath, `${dataset}.nq`), dumpWithTrailingDots);

      // const mappingsDump = await ng.rdf_dump(this.adminSessionid);
      // fs.writeFileSync(pathJoin(this.settings.backupsPath, 'mappings.nq'), mappingsDump);
    } catch (error) {
      throw new Error(`NextGraph backupDataset failed: ${error}\nDataset: ${dataset}`);
    }
  }

  async getWacGraph(dataset: string) {
    const datasetMetadata = await this.getDatasetMetadata(dataset);
    return datasetMetadata?.wacGraph;
  }

  private async getDatasetMetadata(dataset: string): Promise<DatasetMetadata | void> {
    try {
      const response = await ng.sparql_query(
        this.adminSessionid,
        `
          PREFIX semapps: <http://semapps.org/ns/core#>
          SELECT ?mappingUri ?userId ?wacGraph WHERE {
            GRAPH <${this.settings.mappingsNuri}> {
              ?mappingUri a semapps:Dataset ;
                semapps:name "${dataset}" ;
                semapps:userId ?userId ;
                semapps:wacGraph ?wacGraph .
            }
          }
        `
      );

      if (response.results.bindings.length > 0) {
        return {
          mappingUri: response.results.bindings[0].mappingUri.value,
          userId: response.results.bindings[0].userId.value,
          wacGraph: response.results.bindings[0].wacGraph.value
        };
      }
    } catch (error) {
      throw new Error(`NextGraph getDatasetMetadata failed: ${error}\nDataset: ${dataset}`);
    }
  }

  async createNamedGraph(dataset: string) {
    try {
      const session = await this.openOrGetSession(dataset);
      const protectedRepoId = session.protected_store_id.substring(2, 46);
      return await ng.doc_create(session.session_id, 'Graph', 'data:graph', 'store', 'protected', protectedRepoId);
    } catch (error) {
      throw new Error(`NextGraph createNamedGraph failed: ${error}\nDataset: ${dataset}`);
    }
  }

  async namedGraphExists(dataset: string, graphUri: string) {
    try {
      await this.query(dataset, `ASK { GRAPH <${graphUri}> { ?s ?p ?o } }`);
      return true;
    } catch (error) {
      const messages = [`Graph ${graphUri} not found in dataset`, 'Invalid graph_name (too short) in parse_graph_name'];
      if (messages.some(message => (error as Error).message.includes(message))) {
        return false;
      }
      throw new Error(`NextGraph namedGraphExists failed: ${error}\nGraph URI: ${graphUri}`);
    }
  }

  async clearNamedGraph(dataset: string, graphUri: string) {
    try {
      const session = await this.openOrGetSession(dataset);
      await ng.sparql_update(session.session_id, 'DELETE WHERE { ?s ?p ?o }', graphUri);
    } catch (error) {
      throw new Error(`NextGraph clearNamedGraph failed: ${error}\nDataset: ${dataset}\nGraph URI: ${graphUri}`);
    }
  }

  async deleteNamedGraph(dataset: string, graphUri: string): Promise<void> {
    // TODO Delete document when the method will be available
    await this.clearNamedGraph(dataset, graphUri);
  }

  async openOrGetSession(dataset: string): Promise<Session> {
    try {
      if (!openSessions[dataset]) {
        const userId = await this.getUserIdForDataset(dataset);
        openSessions[dataset] = await ng.session_headless_start(userId);
      }
      return openSessions[dataset];
    } catch (error) {
      throw new Error(`NextGraph openSession failed: ${error}`);
    }
  }

  private async getUserIdForDataset(dataset: string): Promise<string> {
    try {
      const response = await ng.sparql_query(
        this.adminSessionid,
        `
        PREFIX semapps: <http://semapps.org/ns/core#>
        SELECT ?userId WHERE {
          GRAPH <${this.settings.mappingsNuri}> {
            ?mapping a semapps:Dataset ;
              semapps:name "${dataset}" ;
              semapps:userId ?userId .
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
    try {
      for (const [dataset, session] of Object.entries(openSessions)) {
        await ng.session_headless_stop(session.session_id, true);
        delete openSessions[dataset];
      }

      // We can't close the admin session because it is started in init, which is called only on creation
      // if (this.adminSessionid) await ng.session_headless_stop(this.adminSessionid, true);

      this.getLogger().info('NextGraph adapter cleaned up');
    } catch (error) {
      throw new Error(`NextGraph cleanup failed: ${error}`);
    }
  }
}
