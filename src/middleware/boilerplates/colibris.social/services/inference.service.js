const { InferenceService } = require('@semapps/inference');
const ontologies = require('../ontologies');

module.exports = {
  mixins: [InferenceService],
  settings: {
    baseUrl: process.env.SEMAPPS_HOME_URL,
    ontologies
  }
};
