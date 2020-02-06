module.exports = {
  ActorService: require('./services/actor'),
  ActivityService: require('./services/activity'),
  CollectionService: require('./services/collection-mongodb'),
  FollowService: require('./services/follow'),
  InboxService: require('./services/inbox'),
  ObjectService: require('./services/object'),
  OutboxService: require('./services/outbox'),
  Routes: require('./routes')
};
