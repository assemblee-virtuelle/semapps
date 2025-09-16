import { Response } from 'node-fetch';

export interface BackendInterface {
  name: string;
  query(query: string, dataset?: string): Promise<any>;
  update(query: string, dataset?: string): Promise<void>;
  dropAll(dataset: string): Promise<void>;
  createDataset(dataset: string): Promise<void>;
  datasetExists(dataset: string): Promise<boolean>;
  listDatasets(): Promise<string[]>;
  deleteDataset(dataset: string): Promise<void>;
  backupDataset(dataset: string): Promise<void>;
}

export abstract class BaseAdapter implements BackendInterface {
  abstract name: string;

  abstract query(query: string, dataset?: string): Promise<any>;

  abstract update(query: string, dataset?: string): Promise<void>;

  abstract dropAll(dataset: string): Promise<void>;

  abstract createDataset(dataset: string): Promise<void>;

  abstract datasetExists(dataset: string): Promise<boolean>;

  abstract listDatasets(): Promise<string[]>;

  abstract deleteDataset(dataset: string): Promise<void>;

  abstract backupDataset(dataset: string): Promise<void>;

  // Optional cleanup method
  async cleanup(): Promise<void> {
    // Default no-op implementation
  }
} 