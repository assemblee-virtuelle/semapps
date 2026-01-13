import { Response } from 'node-fetch';

export interface AdapterInterface {
  name: string;
  init(initSettings: { broker: any }): Promise<void>;
  cleanup(): Promise<void>;
  query(query: string, dataset?: string): Promise<any>;
  update(query: string, dataset?: string): Promise<void>;
  createDataset(dataset: string): Promise<void>;
  datasetExists(dataset: string): Promise<boolean>;
  listDatasets(): Promise<string[]>;
  clearDataset(dataset: string): Promise<void>;
  deleteDataset(dataset: string): Promise<void>;
  backupDataset(dataset: string): Promise<void>;
  createNamedGraph(dataset: string): Promise<string>;
  namedGraphExists(dataset: string, graphUri: string): Promise<boolean>;
  clearNamedGraph(dataset: string, graphUri: string): Promise<void>;
  deleteNamedGraph(dataset: string, graphUri: string): Promise<void>;
  getWacGraph(): string;
}

export abstract class BaseAdapter implements AdapterInterface {
  abstract name: string;

  protected broker: any;

  // Optional init method, override if needed
  async init(initSettings: { broker: any }): Promise<void> {
    this.broker = initSettings.broker;
  }

  protected getLogger() {
    if (this.broker && this.broker.logger) {
      return this.broker.logger;
    }
    return console; // Fallback to console
  }

  // Default no-op implementation, override if needed
  async cleanup(): Promise<void> {
    return Promise.resolve();
  }

  abstract query(query: string, dataset?: string): Promise<any>;

  abstract update(query: string, dataset?: string): Promise<void>;

  abstract createDataset(dataset: string): Promise<void>;

  abstract datasetExists(dataset: string): Promise<boolean>;

  abstract listDatasets(): Promise<string[]>;

  abstract deleteDataset(dataset: string): Promise<void>;

  abstract clearDataset(dataset: string): Promise<void>;

  abstract backupDataset(dataset: string): Promise<void>;

  abstract createNamedGraph(dataset: string): Promise<string>;

  abstract namedGraphExists(dataset: string, graphUri: string): Promise<boolean>;

  abstract clearNamedGraph(dataset: string, graphUri: string): Promise<void>;

  abstract deleteNamedGraph(dataset: string, graphUri: string): Promise<void>;
}
