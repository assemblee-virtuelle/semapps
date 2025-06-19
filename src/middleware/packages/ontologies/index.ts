import OntologiesService from './service.ts';
import OntologiesRegistryService from './sub-services/registry.ts';

export * from './ontologies/core.ts';
export * from './ontologies/solid.ts';
export * from './ontologies/custom.ts';
export { OntologiesService, OntologiesRegistryService };
export const coreOntologies = Object.values(coreOntologies);
export const solidOntologies = Object.values(solidOntologies);
export const customOntologies = Object.values(customOntologies);
