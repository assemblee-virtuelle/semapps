'use strict';

const fetch = require('node-fetch');

module.exports = {
  name: 'adminFuseki',
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
        console.warn(`dataset ${ctx.params.dataset} not exist. creating...`);
        let response2 = await fetch(
          this.settings.sparqlEndpoint + '$/datasets' + '?state=active&dbType=tdb&dbName=' + ctx.params.dataset,
          {
            method: 'POST',
            headers: {
              Authorization: this.Authorization
            }
          }
        );
        if (response2.status === 200) {
          console.log(`dataset ${ctx.params.dataset} created`);
        } else {
          console.warn(`problem creating dataset ${ctx.params.dataset}`);
        }
      } else if (response.status === 200) {
        console.log(`dataset ${ctx.params.dataset} exist`);
      } else {
        let message = `problem initilising dataset ${ctx.params.dataset}`;
        throw new Error(`message`);
      }
      return;
    }
  },
  started() {
    this.Authorization =
      'Basic ' + Buffer.from(this.settings.jenaUser + ':' + this.settings.jenaPassword).toString('base64');
  }
};
