"use strict";

const {
  ServiceBroker
} = require("moleculer");
const ApiGatewayService = require("moleculer-web");
const dummyServiceMath = require("@semapps/dummyservicemath");
const activityPub = require("@semapps/activitypub");
const os = require("os");
const hostname = os.hostname();

// let transporter = process.env.TRANSPORTER || "TCP";
const transporter = null;

// Create broker
// let broker = new ServiceBroker({
// 	namespace: "loadtest",
// 	nodeID: process.argv[2] || hostname + "-server",
// 	transporter,
// 	logger: console,
// 	logLevel: "warn"
// 	//metrics: true
// });

const broker = new ServiceBroker({
  nodeID: process.argv[2] || hostname + "-server",
  logger: console,
  transporter: transporter,
});

broker.createService(dummyServiceMath);
broker.createService(activityPub, {
  settings: {
    homeUrl: process.env.HOME_URL || 'http://localhost:3000/',
    sparqlEndpoint: process.env.SPARQL_ENDPOINT
  }
});
broker.createService({
  mixins: ApiGatewayService,
  settings: {
    middleware: true,
    routes: [activityPub.routes]
  }
});
broker.start();

console.log("Server started. nodeID: ", broker.nodeID, " TRANSPORTER:", transporter, " PID:", process.pid);

setInterval(() => {
  let payload = {
    a: Math.random(0, 100),
    b: Math.random(0, 100)
  };
  broker.call("math.add", payload).then(res => {
    console.log('brocker call result : ', res);
  }).catch(err => {
    throw err;
  });
}, 1000);
