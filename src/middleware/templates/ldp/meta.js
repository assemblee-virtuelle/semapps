"use strict";

module.exports = function(values) {
  return {
    questions: [
      {
        type: 'confirm',
        name: 'localFuseki',
        message: "Do you need a local instance of Jena Fuseki (with Docker)?",
        default: true
      },
      {
        type: 'input',
        name: 'fusekiUrl',
        message: "What is the URL of your Jena Fuseki instance?",
        when(answers) { return !answers.localFuseki; },
        default: 'https://middleware.semapps.org/'
      },
      {
        type: 'confirm',
        name: 'dataSet',
        message: "What is the name of the dataset ?",
        when(answers) { return !answers.localFuseki; },
        default: 'localData'
      },
    ],

    metalsmith: {
      before(metalsmith) {
        const data = metalsmith.metadata();
        if( data.localFuseki ) {
          data.fusekiUrl = 'http://localhost:3030/';
          data.dataSet = 'localData';
        }
      }
    },
    filters: {
      "docker-compose.*": "localFuseki"
    },
    completeMessage: `
Your semantic application is ready!
To get started:

	cd {{projectName}}
	docker-compose up (if you choose a local Jena Fuseki instance)
	npm run dev

		`
  };
};