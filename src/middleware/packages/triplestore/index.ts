import DatasetService from './subservices/dataset.ts';
import TripleStoreAdapter from './adapter.ts';
import TripleStoreService from './service.ts';

export * from './utils.ts';
export * from './adapters/base.ts';
export { default as FusekiAdapter } from './adapters/fuseki.ts';
export { default as NextGraphAdapter } from './adapters/nextgraph.ts';
export { DatasetService, TripleStoreAdapter, TripleStoreService };
