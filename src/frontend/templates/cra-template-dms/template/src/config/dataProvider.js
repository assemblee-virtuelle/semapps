import { dataProvider as semanticDataProvider, httpClient } from '@semapps/semantic-data-provider';
import ontologies from './ontologies.json';
import dataServers from './dataServers';
import resources from './resources';

const dataProvider = semanticDataProvider({
  dataServers,
  httpClient,
  resources,
  ontologies,
  jsonContext: `${process.env.REACT_APP_MIDDLEWARE_URL}context.json`
});

export default dataProvider;
