import { FULL_ACTOR_TYPES, FULL_OBJECT_TYPES } from './constants.ts';

export default [
  {
    path: '/as/actor',
    acceptedTypes: Object.values(FULL_ACTOR_TYPES)
  },
  {
    path: '/as/object',
    acceptedTypes: Object.values(FULL_OBJECT_TYPES)
  }
];
