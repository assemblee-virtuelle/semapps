import OntologiesService from './service.ts';
import OntologiesRegistryService from './sub-services/registry.ts';

export { OntologiesService, OntologiesRegistryService };

export * from './ontologies/core/index.ts';
export * from './ontologies/solid/index.ts';
export * from './ontologies/custom/index.ts';
export { skos } from './ontologies/core/index.ts';
