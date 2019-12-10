module.exports = {
  path: '/ActivityPub',
  aliases: {
    'POST outbox': 'activitypub.outbox.post',
    'GET outbox': 'activitypub.outbox.list'
  }
};
