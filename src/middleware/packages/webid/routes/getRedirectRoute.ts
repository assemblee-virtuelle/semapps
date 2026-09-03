import path from 'path';
import { parseUrl, saveDatasetMeta } from '@semapps/middlewares';

const getRedirectRoute = (basePath: string) => {
  const middlewares = [parseUrl, saveDatasetMeta];

  return {
    name: 'redirect-to-webid',
    path: path.join(basePath, '/:username'),
    authorization: false,
    authentication: false,
    aliases: {
      'GET /': [...middlewares, 'webid.redirectToWebId']
    }
  };
};

export default getRedirectRoute;
