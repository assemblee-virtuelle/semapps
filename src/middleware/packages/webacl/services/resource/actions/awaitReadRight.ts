import { ActionSchema } from 'moleculer';

export const action = {
  visibility: 'public',
  params: {
    resourceUri: { type: 'string' },
    webId: { type: 'string' },
    timeout: { type: 'number', default: 10000 }
  },
  handler(ctx) {
    const { resourceUri, webId, timeout } = ctx.params;
    return new Promise(resolve => {
      let i = 0;
      let interval: any;
      const checkRights = () => {
        ctx
          .call('webacl.resource.hasRights', {
            resourceUri,
            rights: { read: true },
            webId
          })
          .then(rights => {
            if (rights.read === true) {
              if (interval) clearInterval(interval);
              resolve(true);
              // @ts-expect-error TS(18048): 'timeout' is possibly 'undefined'.
            } else if (i * 1000 >= timeout) {
              if (interval) clearInterval(interval);
              resolve(false);
            }
            i++;
          });
      };
      checkRights(); // Try immediately, then launch interval
      interval = setInterval(checkRights, 1000);
    });
  }
} satisfies ActionSchema;
