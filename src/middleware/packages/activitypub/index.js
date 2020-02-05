module.exports = {
  ActorService: require('./services/actor'),
  ActivityService: require('./services/activity'),
  CollectionService: require('./services/collection'),
  FollowService: require('./services/follow'),
  InboxService: require('./services/inbox'),
  OutboxService: require('./services/outbox'),
  createServices: require('./createServices'),
  Routes: require('./routes')
};
