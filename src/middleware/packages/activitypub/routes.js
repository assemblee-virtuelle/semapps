module.exports = {
  path: '/activitypub',
  aliases: {
    'POST actor/:username/outbox': 'activitypub.outbox.post',
    'GET actor/:username/outbox': 'activitypub.outbox.list',
    'GET actor/:username/inbox': 'activitypub.inbox.list',
    'GET actor/:username/followers': 'activitypub.follow.listFollowers',
    'GET actor/:username/following': 'activitypub.follow.listFollowing'
  }
};
