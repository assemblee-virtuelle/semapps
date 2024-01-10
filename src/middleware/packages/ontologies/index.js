const OntologiesService = require('./service');
const OntologiesRegistryService = require('./sub-services/registry');
const coreOntologies = require('./ontologies/core');
const customOntologies = require('./ontologies/custom');

module.exports = {
  OntologiesService,
  OntologiesRegistryService,
  coreOntologies: Object.values(coreOntologies),
  customOntologies: Object.values(customOntologies),
  ...coreOntologies,
  ...customOntologies
};
