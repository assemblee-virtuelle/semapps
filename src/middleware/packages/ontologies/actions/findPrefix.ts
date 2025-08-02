import fetch from 'node-fetch';
import { defineAction } from 'moleculer';
import { isURL } from '../utils.ts';

const Schema = defineAction({
  visibility: 'public',
  params: {
    // @ts-expect-error TS(2322): Type 'string' is not assignable to type 'Parameter... Remove this comment to see the full error message
    uri: 'string'
  },
  async handler(ctx) {
    const { uri } = ctx.params;

    if (!isURL(uri)) throw new Error(`The uri param of the ontologies.findPrefix action must be a full URL`);

    const response = await fetch(`http://prefix.cc/?q=${encodeURIComponent(uri)}`, { redirect: 'manual' });

    if (response.status === 302) {
      const redirectUrl = response.headers.get('Location');

      const result = redirectUrl?.replace('http://prefix.cc/', '').split(':');

      return result && result[0];
    }

    return null;
  }
});

export default Schema;
