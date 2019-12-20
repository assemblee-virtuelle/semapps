module.exports = {
  path: '/activitypub',
  aliases: {
    'POST outbox': 'activitypub.outbox.post',
    'GET outbox': 'activitypub.outbox.list',
    'GET actor/:username/followers': 'activitypub.follow.listFollowers'
  }
};
