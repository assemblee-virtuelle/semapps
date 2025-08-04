import fetch from 'node-fetch';

const Schema = {
  visibility: 'public',
  params: {
    prefix: 'string'
  },
  async handler(ctx) {
    const { prefix } = ctx.params;

    const response = await fetch(`http://prefix.cc/${prefix}.file.json`);

    if (response.ok) {
      const json = await response.json();

      return json && json[prefix];
    }

    return null;
  }
};

export default Schema;
