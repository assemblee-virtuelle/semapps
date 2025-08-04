const appendPrefix = types => Object.fromEntries(Object.entries(types).map(([key, value]) => [key, AS_PREFIX + value]));
const AS_PREFIX = 'https://www.w3.org/ns/activitystreams#';
const PUBLIC_URI = `${AS_PREFIX}Public`;

const ACTIVITY_TYPES = {
  ACCEPT: 'Accept',
  ADD: 'Add',
  ANNOUNCE: 'Announce',
  ARRIVE: 'Arrive',
  BLOCK: 'Block',
  CREATE: 'Create',
  DELETE: 'Delete',
  DISLIKE: 'Dislike',
  FLAG: 'Flag',
  FOLLOW: 'Follow',
  IGNORE: 'Ignore',
  INVITE: 'Invite',
  JOIN: 'Join',
  LEAVE: 'Leave',
  LIKE: 'Like',
  LISTEN: 'Listen',
  MOVE: 'Move',
  OFFER: 'Offer',
  QUESTION: 'Question',
  REJECT: 'Reject',
  READ: 'Read',
  REMOVE: 'Remove',
  TENTATIVE_REJECT: 'TentativeReject',
  TENTATIVE_ACCEPT: 'TentativeAccept',
  TRAVEL: 'Travel',
  UNDO: 'Undo',
  UPDATE: 'Update',
  VIEW: 'View'
};

const ACTOR_TYPES = {
  APPLICATION: 'Application',
  GROUP: 'Group',
  ORGANIZATION: 'Organization',
  PERSON: 'Person',
  SERVICE: 'Service'
};

const OBJECT_TYPES = {
  ARTICLE: 'Article',
  AUDIO: 'Audio',
  DOCUMENT: 'Document',
  EVENT: 'Event',
  IMAGE: 'Image',
  NOTE: 'Note',
  PAGE: 'Page',
  PLACE: 'Place',
  PROFILE: 'Profile',
  RELATIONSHIP: 'Relationship',
  TOMBSTONE: 'Tombstone',
  VIDEO: 'Video'
};

export { AS_PREFIX, PUBLIC_URI, ACTIVITY_TYPES, ACTOR_TYPES, OBJECT_TYPES };
export const FULL_ACTIVITY_TYPES = appendPrefix(ACTIVITY_TYPES);
export const FULL_ACTOR_TYPES = appendPrefix(ACTOR_TYPES);
export const FULL_OBJECT_TYPES = appendPrefix(OBJECT_TYPES);
