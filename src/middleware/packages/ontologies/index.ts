import OntologiesService from './service.ts';
import OntologiesRegistryService from './sub-services/registry.ts';

import * as core from './ontologies/core/index.ts';
import * as solid from './ontologies/solid/index.ts';
import * as custom from './ontologies/custom/index.ts';

export * from './ontologies/core/index.ts';
export * from './ontologies/solid/index.ts';
export * from './ontologies/custom/index.ts';

export { OntologiesService, OntologiesRegistryService };

export const coreOntologies = Object.values(core);
export const solidOntologies = Object.values(solid);
export const customOntologies = Object.values(custom);
