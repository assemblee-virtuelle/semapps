import { dataProvider as semanticDataProvider, httpClient } from '@semapps/semantic-data-provider';
import ontologies from './ontologies.json';
import * as resources from '../resources';

const dataProvider = semanticDataProvider({
  sparqlEndpoint: process.env.REACT_APP_MIDDLEWARE_URL + 'sparql',
  httpClient,
  resources: Object.fromEntries(Object.entries(resources).map(([k, v]) => [k, v.dataModel])),
  ontologies,
  jsonContext: process.env.REACT_APP_MIDDLEWARE_URL + 'context.json',
  uploadsContainerUri: process.env.REACT_APP_MIDDLEWARE_URL + 'files'
});

export default dataProvider;
