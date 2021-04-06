import { authProvider as semappsAuthProvider } from '@semapps/auth-provider';
import { httpClient } from '@semapps/semantic-data-provider';
import * as resources from '../resources';

const authProvider = semappsAuthProvider({
  middlewareUri: process.env.REACT_APP_MIDDLEWARE_URL,
  httpClient,
  checkPermissions: true,
  resources: Object.fromEntries(Object.entries(resources).map(([k, v]) => [k, v.dataModel]))
});

export default authProvider;
