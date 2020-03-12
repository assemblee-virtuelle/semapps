'use strict';

const fetch = require('node-fetch');

const FusekiAdminService = {
  name: 'fuseki-admin',
  settings: {
    sparqlEndpoint: null,
    jenaUser: null,
    jenaPassword: null
  },
  actions: {
    async initDataset(ctx) {
      let response = await fetch(this.settings.sparqlEndpoint + '$/datasets/' + ctx.params.dataset, {
        method: 'GET',
        headers: {
          Authorization: this.Authorization
        }
      });
      if (response.status === 404) {
        console.warn(`Data ${ctx.params.dataset} doesn't exist. Creating...`);
        let response2 = await fetch(
          this.settings.sparqlEndpoint + '$/datasets' + '?state=active&dbType=tdb2&dbName=' + ctx.params.dataset,
          {
            method: 'POST',
            headers: {
              Authorization: this.Authorization
            }
          }
        );
        if (response2.status === 200) {
          console.log(`Dataset ${ctx.params.dataset} created`);
        } else {
          console.warn(`Problem creating dataset ${ctx.params.dataset}`);
        }
      } else if (response.status === 200) {
        // Dataset exist, do nothing...
      } else {
        throw new Error(`Problem initializing dataset ${ctx.params.dataset}`);
      }
      return;
    }
  },
  started() {
    this.Authorization =
      'Basic ' + Buffer.from(this.settings.jenaUser + ':' + this.settings.jenaPassword).toString('base64');
  }
};

module.exports = FusekiAdminService;
