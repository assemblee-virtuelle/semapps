module.exports = {
  path: '/activitypub',
  aliases: {
    'POST outbox': 'activitypub.outbox.post',
    'GET outbox': 'activitypub.outbox.list',
    'GET followers': 'activitypub.follow.listFollowers'
  }
};
