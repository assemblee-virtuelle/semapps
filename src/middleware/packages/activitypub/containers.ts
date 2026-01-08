import { FULL_ACTOR_TYPES, FULL_OBJECT_TYPES } from './constants.ts';

export default [
  {
    path: '/as/actor',
    types: Object.values(FULL_ACTOR_TYPES)
  },
  {
    path: '/as/object',
    types: Object.values(FULL_OBJECT_TYPES)
  }
];
