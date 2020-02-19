const { ServiceBroker } = require('moleculer');
const MongoDbAdapter = require('moleculer-db-adapter-mongo');
const express = require('express');
const {
  ActivityService,
  OutboxService,
  InboxService,
  FollowService,
  MongoDbCollectionService,
  ActorService,
  ObjectService
} = require('@semapps/activitypub');

const FormService = require('./services/form');
const ApiService = require('./services/api');
const MatchBotService = require('./services/match-bot');
const ThemeService = require('./services/theme');
const CONFIG = require('./config');

const broker = new ServiceBroker();

broker.createService(MongoDbCollectionService, {
  adapter: new MongoDbAdapter(CONFIG.MONGODB_URL)
});
broker.createService(ActorService, {
  adapter: new MongoDbAdapter(CONFIG.MONGODB_URL),
  settings: {
    containerUri: CONFIG.HOME_URL + 'users/',
    context: {
      '@vocab': 'https://www.w3.org/ns/activitystreams#',
      foaf: 'http://xmlns.com/foaf/0.1/',
      pair: 'http://virtual-assembly.org/ontologies/pair#'
    }
  }
});
broker.createService(ActivityService, {
  adapter: new MongoDbAdapter(CONFIG.MONGODB_URL),
  settings: {
    containerUri: CONFIG.HOME_URL + 'activities/'
  }
});
broker.createService(ObjectService, {
  adapter: new MongoDbAdapter(CONFIG.MONGODB_URL),
  settings: {
    containerUri: CONFIG.HOME_URL + 'objects/'
  }
});
broker.createService(FollowService);
broker.createService(InboxService);
broker.createService(OutboxService);

broker.createService(ThemeService, {
  adapter: new MongoDbAdapter(CONFIG.MONGODB_URL),
  settings: {
    containerUri: CONFIG.HOME_URL + 'themes/',
    themes: [
      'Agriculture & alimentation',
      'Economie locale',
      'Démocratie',
      'Arts & culture',
      'Education',
      'Habitat & oasis',
      'Energie',
      'Transport',
      'Bien-être',
      'Autre'
    ]
  }
});

broker.createService(FormService);
broker.createService(MatchBotService);
const apiService = broker.createService(ApiService);

const app = express();
app.use(apiService.express());
app.use(express.static('public'));

app.listen(3000, err => {
  if (err) {
    console.error(err);
  } else {
    console.log('Listening on port 3000');
  }
});

broker.start();
