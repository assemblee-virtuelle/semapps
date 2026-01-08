// @ts-expect-error TS(2305): Module '"@semapps/semantic-data-provider"' has no ... Remove this comment to see the full error message
import { dataProvider as semanticDataProvider, httpClient } from '@semapps/semantic-data-provider';
// @ts-expect-error TS(2732): Cannot find module './ontologies.json'. Consider u... Remove this comment to see the full error message
import ontologies from './ontologies.json';
import dataServers from './dataServers';
import resources from './resources';

const dataProvider = semanticDataProvider({
  // @ts-expect-error TS(2322): Type '{ main: { baseUrl: string | undefined; defau... Remove this comment to see the full error message
  dataServers,
  httpClient,
  resources,
  ontologies,
  jsonContext: `${process.env.REACT_APP_MIDDLEWARE_URL}context.json`
});

export default dataProvider;
