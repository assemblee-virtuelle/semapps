const OntologiesService = require('./service');
const OntologiesRegistryService = require('./sub-services/registry');
const coreOntologies = require('./ontologies/core');
const customOntologies = require('./ontologies/custom');
const solidOntologies = require('./ontologies/solid');

module.exports = {
  OntologiesService,
  OntologiesRegistryService,
  coreOntologies: Object.values(coreOntologies),
  solidOntologies: Object.values(solidOntologies),
  customOntologies: Object.values(customOntologies),
  ...coreOntologies,
  ...solidOntologies,
  ...customOntologies
};
