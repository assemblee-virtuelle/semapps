import fetch, { Response } from 'node-fetch';
import urlJoin from 'url-join';
import { SparqlJsonParser } from 'sparqljson-parse';
import { throw403, throw500 } from '@semapps/middlewares';
import { BaseAdapter } from './base.ts';
import { MIME_TYPES, negotiateType } from '@semapps/mime-types';

const delay = (t: any) => new Promise(resolve => setTimeout(resolve, t));

export default class FusekiAdapter extends BaseAdapter {
  name = 'fuseki';

  private settings: { url: string, user: string, password: string };

  private sparqlJsonParser: SparqlJsonParser;

  constructor(settings: any) {
    super();
    if (!settings.url) throw new Error('URL is required');
    if (!settings.user) throw new Error('User is required');
    if (!settings.password) throw new Error('Password is required');
    this.settings = settings;
    this.sparqlJsonParser = new SparqlJsonParser();

  }

  async fetch(url:string, { method = 'POST', body, headers }: { method?: string, body?: any, headers?: any }) {
    const response = await fetch(url, {
      method,
      body,
      headers: {
        Accept: 'application/json',
        Authorization: `Basic ${Buffer.from(`${this.settings.user}:${this.settings.password}`).toString('base64')}`,
        ...headers
      }
    });

    if (!response.ok && response.status !== 404) {
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
  }

  async query(dataset: string, query: string) {

    const acceptNegotiatedType = negotiateType('application/json');
    // const acceptType = acceptNegotiatedType.mime;

    const response = await this.fetch(urlJoin(this.settings.url, dataset, 'query'), {
      body: query,
      headers: {
        'Content-Type': 'application/sparql-query',
        Accept: acceptNegotiatedType.fusekiMapping
      }
    });

    const regex = /(CONSTRUCT|SELECT|ASK).*/gm;
    // @ts-expect-error TS(2531): Object is possibly 'null'.
    const verb = regex.exec(query)[1];
    switch (verb) {
      case 'ASK':
        return (await response.json()).boolean;

      case 'SELECT':
        const jsonResult = await response.json();
        return await this.sparqlJsonParser.parseJsonResults(jsonResult);
      case 'CONSTRUCT':
        // const textResult = await response.text();
        return await response.json();

      default:
        throw new Error('SPARQL Verb not supported');
    }

  }

  async update(dataset: string, query: string) {
    const response = await this.fetch(urlJoin(this.settings.url, dataset, 'update'), {
      body: query,
      headers: {
        'Content-Type': 'application/sparql-update',
      }
    });

    if (!response.ok) {
      const text = await response.text();
      if (response.status === 403) {
        throw403(text);
      } else {
        throw500(`Update failed: ${response.statusText}. Query: ${query}`);
      }
    }
  }

  async dropAll(dataset: string) {
    const response = await this.fetch(urlJoin(this.settings.url, dataset, 'update'), {
      body: 'update=CLEAR+ALL',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    if (!response.ok) {
      throw new Error(`Failed to drop all data from dataset ${dataset}: ${response.statusText}`);
    }
  }

  async createDataset(dataset: string) {
    const response = await this.fetch(urlJoin(this.settings.url, '$/datasets') + `?dbName=${dataset}&dbType=tdb2`, {
      method: 'POST',
    });

    if (response.status === 200) {
      await this.waitForDatasetCreation(dataset);
    } else {
      throw new Error(`Error when creating dataset ${dataset}: ${await response.text()}`);
    }
  }

  async datasetExists(dataset: string): Promise<boolean> {
    const response = await this.fetch(urlJoin(this.settings.url, '$/datasets/', dataset), {});
    return response.status === 200;

  }

  async listDatasets() {
    const response = await this.fetch(urlJoin(this.settings.url, '$/datasets'), {method: 'GET'});

    if (response.ok) {
      const json = await response.json();
      return json.datasets.map((dataset: any) => dataset['ds.name'].substring(1));
    }
    return [];
  }

  async deleteDataset(dataset: string) {
    const response = await this.fetch(urlJoin(this.settings.url, '$/datasets', dataset), {
      method: 'DELETE'
    });
    if (!response.ok) {
      throw new Error(`Failed to delete dataset ${dataset}: ${response.statusText}`);
    }
}

  async backupDataset(dataset: string) {
        // Ask Fuseki to backup the given dataset
        const response = await fetch(urlJoin(this.settings.url, '$/backup', dataset), {});

        // Wait for backup to complete
        const { taskId } = await response.json();
        await this.waitForTaskCompletion(taskId);
  }

  async waitForDatasetCreation(dataset: string) {
    if (!dataset) throw new Error('Unable to wait for dataset creation. The parameter dataset is missing');
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
        method: 'GET'
      });

      if (response.ok) {
        task = await response.json();
      }
    } while (!task || !task.finished);
  }
  
} 