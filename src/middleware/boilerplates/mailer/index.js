const { ServiceBroker } = require('moleculer');
const MongoDbAdapter = require('moleculer-db-adapter-mongo');
const express = require('express');
const { ActivityPubService } = require('@semapps/activitypub');

const FormService = require('./services/form');
const ApiService = require('./services/api');
const MatchBotService = require('./services/match-bot');
const MailQueueService = require('./services/mail-queue');
const MailerService = require('./services/mailer');
const ThemeService = require('./services/theme');
const CONFIG = require('./config');

const broker = new ServiceBroker();

broker.createService(ActivityPubService, {
  baseUri: CONFIG.HOME_URL,
  // context: {
  //   '@vocab': 'https://www.w3.org/ns/activitystreams',
  //   pair: 'http://virtual-assembly.org/ontologies/pair#'
  // },
  storage: {
    collections: new MongoDbAdapter(CONFIG.MONGODB_URL),
    activities: new MongoDbAdapter(CONFIG.MONGODB_URL),
    actors: new MongoDbAdapter(CONFIG.MONGODB_URL),
    objects: new MongoDbAdapter(CONFIG.MONGODB_URL)
  }
});

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

broker.createService(MailQueueService, {
  adapter: new MongoDbAdapter(CONFIG.MONGODB_URL),
  settings: {
    containerUri: CONFIG.HOME_URL + 'mails/',
  }
});

broker.createService(FormService);
broker.createService(MailerService);
broker.createService(MatchBotService);
const apiService = broker.createService(ApiService);

const app = express();
app.use(apiService.express());
app.use(express.static('public'));

broker.start().then(() => {
  app.listen(process.env.NODE_PORT || 3000, err => {
    if (err) {
      console.error(err);
    } else {
      console.log('Listening on port ' + (process.env.NODE_PORT || 3000));
    }
  });
});
