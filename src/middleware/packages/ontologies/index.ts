import OntologiesService from './service.ts';
import OntologiesRegistryService from './sub-services/registry.ts';

// @ts-expect-error TS(2307): Cannot find module './ontologies/core.ts' or its c... Remove this comment to see the full error message
export * from './ontologies/core.ts';
// @ts-expect-error TS(2307): Cannot find module './ontologies/solid.ts' or its ... Remove this comment to see the full error message
export * from './ontologies/solid.ts';
// @ts-expect-error TS(2307): Cannot find module './ontologies/custom.ts' or its... Remove this comment to see the full error message
export * from './ontologies/custom.ts';
export { OntologiesService, OntologiesRegistryService };
// @ts-expect-error TS(7022): 'coreOntologies' implicitly has type 'any' because... Remove this comment to see the full error message
export const coreOntologies = Object.values(coreOntologies);
// @ts-expect-error TS(7022): 'solidOntologies' implicitly has type 'any' becaus... Remove this comment to see the full error message
export const solidOntologies = Object.values(solidOntologies);
// @ts-expect-error TS(7022): 'customOntologies' implicitly has type 'any' becau... Remove this comment to see the full error message
export const customOntologies = Object.values(customOntologies);
