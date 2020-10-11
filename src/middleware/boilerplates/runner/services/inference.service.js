const { InferenceService } = require('@semapps/inference');
const CONFIG = require('../config');
const ontologies = require('../ontologies');

module.exports = {
  mixins: [InferenceService],
  settings: {
    baseUrl: CONFIG.HOME_URL,
    ontologies
  }
};
