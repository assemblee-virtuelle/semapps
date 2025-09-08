import fetch from 'node-fetch';
import { isURL } from '../utils.ts';
import { ActionSchema } from 'moleculer';

const Schema = {
  visibility: 'public',
  params: {
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
} satisfies ActionSchema;

export default Schema;
