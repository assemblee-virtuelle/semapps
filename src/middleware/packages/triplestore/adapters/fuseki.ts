import fetch from 'node-fetch';
import urlJoin from 'url-join';
import { SparqlJsonParser } from 'sparqljson-parse';
import { throw403, throw500, throw404 } from '@semapps/middlewares';
import { Errors } from 'moleculer';
import { BaseAdapter } from './base.ts';

const delay = (t: any) => new Promise(resolve => setTimeout(resolve, t));
const { MoleculerError } = Errors;

export default class FusekiAdapter extends BaseAdapter {
  name = 'fuseki';

  private settings: {
    url: string, // The URL of the Fuseki server
    user: string, // The username for the Fuseki server
    password: string // The password for the Fuseki server
  };

  private sparqlJsonParser: SparqlJsonParser;

  constructor(settings: any) {
    super();
    if (!settings.url) throw new Error('URL is required');
    if (!settings.user) throw new Error('User is required');
    if (!settings.password) throw new Error('Password is required');
    this.settings = settings;
    this.sparqlJsonParser = new SparqlJsonParser();
  }

  /*
   * Fetch the given URL with the given method, body and headers
   * Intended to be used internally to call the Fuseki server
   * 
   * @param url - The URL to fetch
   * @param method - The method to use (default is POST)
   * @param body - The body to send (default is undefined)
   * @param headers - The headers to send (default is Accept: application/json, and the authorization header)
   * @returns The response from the URL
   */
  async fetch(url:string, { operation = 'unknown operation', method = 'POST', body, headers }: { operation?: string, method?: string, body?: any, headers?: any }) {
    const response = await fetch(url, {
      method,
      body,
      headers: {
        Accept: 'application/json',
        Authorization: `Basic ${Buffer.from(`${this.settings.user}:${this.settings.password}`).toString('base64')}`,
        ...headers
      }
    });

    if (!response.ok) {
      const text = await response.text();
      // TODO : check if we could remove the comparison with 500 and permissions violation since we switched to jena-fuseki 5.0.0 or above
      if (response.status === 403 || (response.status === 500 && text.includes('permissions violation'))) {
        throw403(`Fuseki ${operation} failed: ${text}\nURL: ${url}\nQuery: ${body}`);
      } else if (response.status === 404) {
        throw404(`Fuseki ${operation} failed: ${text}\nURL: ${url}\nQuery: ${body}`);
      } else {
        throw500(`Fuseki ${operation} failed: Unable to reach SPARQL endpoint ${url}. Error message: ${response.statusText}. Query: ${body}`);
      }
    }

    return response;
  }

  async query(dataset: string, query: string) {
    const response = await this.fetch(urlJoin(this.settings.url, dataset, 'query'), {
      operation: 'query',
      body: query,
      headers: {
        'Content-Type': 'application/sparql-query',
        Accept: 'application/ld+json, application/sparql-results+json'
      }
    });

    const regex = /(CONSTRUCT|SELECT|ASK).*/gm;
    // @ts-expect-error TS(2531): Object is possibly 'null'.
    const verb = regex.exec(query)[1];
    switch (verb) {
      case 'ASK':
        return (await response.json()).boolean;
      case 'SELECT':
        return this.sparqlJsonParser.parseJsonResults(await response.json());
      case 'CONSTRUCT':
        return await response.json();
      default:
        throw new Error('SPARQL Verb not supported');
    }
  }

  async update(dataset: string, query: string) {
    await this.fetch(urlJoin(this.settings.url, dataset, 'update'), {
      operation: 'update',
      body: query,
      headers: {
        'Content-Type': 'application/sparql-update',
      }
    });
  }

  async dropAll(dataset: string) {
    await this.fetch(urlJoin(this.settings.url, dataset, 'update'), {
      operation: 'dropAll',
      body: 'update=CLEAR+ALL',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
  }

  async createDataset(dataset: string) {
    await this.fetch(urlJoin(this.settings.url, '$/datasets') + `?dbName=${dataset}&dbType=tdb2`, {
      operation: 'createDataset',
      method: 'POST',
    });
    await this.waitForDatasetCreation(dataset);
    this.getLogger().info(`Fuseki dataset created: ${dataset}`);
  }

  async datasetExists(dataset: string): Promise<boolean> {
    try {
      const response = await this.fetch(urlJoin(this.settings.url, '$/datasets/', dataset), {
        operation: 'datasetExists',
      });
      return response.status === 200;
    } catch (error) {
      if (!(error instanceof MoleculerError && error.code === 404)) throw error;
      return false;
    }
  }

  async listDatasets() {
    const response = await this.fetch(urlJoin(this.settings.url, '$/datasets'), {
      operation: 'listDatasets',
      method: 'GET'
    });
    const json = await response.json();
    return json.datasets.map((dataset: any) => dataset['ds.name'].substring(1));
  }

  async deleteDataset(dataset: string) {
    await this.fetch(urlJoin(this.settings.url, '$/datasets', dataset), {
      operation: 'deleteDataset',
      method: 'DELETE'
    });
    this.getLogger().info(`Fuseki dataset deleted: ${dataset}`);
  }

  // TODO : see how we can test this
  async backupDataset(dataset: string) {
    // Ask Fuseki to backup the given dataset
    const response = await this.fetch(urlJoin(this.settings.url, '$/backup', dataset), {
      operation: 'backupDataset',
    });

    // Wait for backup to complete
    const { taskId } = await response.json();
    await this.waitForTaskCompletion(taskId);
    this.getLogger().info(`Fuseki dataset backed up: ${dataset}`);
  }

  async waitForDatasetCreation(dataset: string) {
    let datasetExist;
    do {
      await delay(1000);
      datasetExist = await this.datasetExists(dataset);
    } while (!datasetExist);
  }

  async waitForTaskCompletion(taskId: string) {
    let task;
    do {
      await delay(1000);
      const response = await this.fetch(urlJoin(this.settings.url, '$/tasks/', `${taskId}`), {
        operation: 'Wait for Task Completion',
        method: 'GET'
      });

      if (response.ok) {
        task = await response.json();
      }
    } while (!task || !task.finished);
  }
} 