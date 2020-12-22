import { dataProvider as semanticDataProvider, httpClient } from '@semapps/semantic-data-provider';
import resources from "./resources";
import ontologies from "./ontologies.json";

import documents from '../resources/documents';
import events from '../resources/events';
import themes from '../resources/themes';
import projects from '../resources/projects';
import organizations from '../resources/organizations';
import skills from '../resources/skills';
import users from '../resources/users';

const dataProvider = semanticDataProvider({
  sparqlEndpoint: process.env.REACT_APP_MIDDLEWARE_URL + 'sparql',
  httpClient,
  resources: {
    ...resources,
    ...organizations.dataModel
  },
  ontologies,
  jsonContext: process.env.REACT_APP_MIDDLEWARE_URL + 'context.json',
  uploadsContainerUri: process.env.REACT_APP_MIDDLEWARE_URL + 'files'
});

export default dataProvider;
