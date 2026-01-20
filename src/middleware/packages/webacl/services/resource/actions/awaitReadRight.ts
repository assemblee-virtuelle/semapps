import { ActionSchema } from 'moleculer';
import { WacPermission } from '../../../types.ts';

const AwaitReadRightAction = {
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
          .call<WacPermission, any>('webacl.resource.hasRights', {
            resourceUri,
            rights: { read: true },
            webId
          })
          .then(rights => {
            if (rights.read === true) {
              if (interval) clearInterval(interval);
              resolve(true);
            } else if (i * 1000 >= timeout) {
              if (interval) clearInterval(interval);
              resolve(false);
            }
            i += 1;
          });
      };
      checkRights(); // Try immediately, then launch interval
      interval = setInterval(checkRights, 1000);
    });
  }
} satisfies ActionSchema;

export default AwaitReadRightAction;
