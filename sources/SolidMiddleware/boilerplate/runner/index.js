'use strict';

const { ServiceBroker } = require('moleculer');
const ApiGatewayService = require('moleculer-web');
const dummyServiceMath = require('@semapps/dummyservicemath');
const { OutboxService, Routes: ActivityPubRoutes } = require('@semapps/activitypub');
const TripleStoreService = require('@semapps/triplestore');
const os = require('os');
const hostname = os.hostname();

// let transporter = process.env.TRANSPORTER || "TCP";
const transporter = null;

const broker = new ServiceBroker({
  nodeID: process.argv[2] || hostname + '-server',
  logger: console,
  transporter: transporter
});

broker.createService(dummyServiceMath);
broker.createService(OutboxService, {
  settings: {
    homeUrl: 'http://localhost:3000/'
  }
});
broker.createService(TripleStoreService, {
  settings: {
    sparqlEndpoint: 'http://51.68.81.68:3030/activities/',
    sparqlHeaders: {
      Authorization: 'Basic ' + Buffer.from('admin:admin').toString('base64')
    }
  }
});
broker.createService(ApiGatewayService, {
  settings: {
    routes: [ActivityPubRoutes]
  }
});

broker.start();

console.log('Server started. nodeID: ', broker.nodeID, ' TRANSPORTER:', transporter, ' PID:', process.pid);

setInterval(() => {
  let payload = {
    a: Math.random(0, 100),
    b: Math.random(0, 100)
  };
  broker
    .call('math.add', payload)
    .then(res => {
      console.log('brocker call result : ', res);
    })
    .catch(err => {
      throw err;
    });
}, 1000);
