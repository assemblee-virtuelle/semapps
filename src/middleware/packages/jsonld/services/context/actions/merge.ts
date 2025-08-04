import { isURL, isObject, mergeObjectInArray } from '../../../utils/utils.ts';

const Schema = {
  visibility: 'public',
  params: {
    a: {
      type: 'multi',
      rules: [{ type: 'array' }, { type: 'object' }, { type: 'string' }],
      optional: true
    },
    b: {
      type: 'multi',
      rules: [{ type: 'array' }, { type: 'object' }, { type: 'string' }],
      optional: true
    }
  },
  async handler(ctx) {
    const { a, b } = ctx.params;

    if (!a) return b;
    if (!b) return a;

    if (Array.isArray(a)) {
      if (Array.isArray(b)) {
        return [...a, ...b];
      } else if (isURL(b)) {
        return [...a, b];
      } else if (isObject(b)) {
        return mergeObjectInArray(b, a);
      }
    } else if (isURL(a)) {
      if (Array.isArray(b)) {
        return [a, ...b];
      } else if (isURL(b)) {
        return [a, b];
      } else if (isObject(b)) {
        return [a, b];
      }
    } else if (isObject(a)) {
      if (Array.isArray(b)) {
        return mergeObjectInArray(a, b);
      } else if (isURL(b)) {
        return [b, a];
      } else if (isObject(b)) {
        return { ...a, ...b };
      }
    }

    throw new Error('Could not merge JSON-LD contexts');
  }
};

export default Schema;
