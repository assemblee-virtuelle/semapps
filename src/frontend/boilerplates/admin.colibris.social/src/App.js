import React from 'react';
import { Admin, Resource } from 'react-admin';
import polyglotI18nProvider from 'ra-i18n-polyglot';
import frenchMessages from 'ra-language-french';
import { dataProvider, httpClient } from '@semapps/semantic-data-provider';

import action from './resources/Action';
import actor from './resources/Actor';
import device from './resources/Device';
import hostingService from './resources/HostingService';
import note from './resources/Note';
import notification from './resources/Notification';
import project from './resources/Project';
import subscriber from './resources/Subscriber';
import theme from './resources/Theme';

import ontologies from './config/ontologies';
import resources from './config/resources';
import ColibrisLayout from './components/ColibrisLayout';
import colibrisTheme from './theme';

function App() {
  const dataProviderConfig = {
    sparqlEndpoint: process.env.REACT_APP_MIDDLEWARE_URL + 'sparql',
    httpClient,
    resources,
    ontologies,
    jsonContext: window.location.origin + '/context.json',
    uploadsContainerUri: process.env.REACT_APP_MIDDLEWARE_URL + 'files'
  };

  return (
    <Admin
      dataProvider={dataProvider(dataProviderConfig)}
      i18nProvider={polyglotI18nProvider(() => frenchMessages)}
      theme={colibrisTheme}
      layout={ColibrisLayout}
    >
      <Resource name="Actor" {...actor} />
      <Resource name="Action" {...action} />
      <Resource name="Subscriber" {...subscriber} />
      <Resource name="Project" {...project} />
      <Resource name="HostingService" {...hostingService} />
      <Resource name="Note" {...note} />
      <Resource name="Theme" {...theme} />
      <Resource name="Device" {...device} />
      <Resource name="Notification" {...notification} />
      {/* Resources not displayed */}
      <Resource name="Tag" />
      <Resource name="Oasis" />
      <Resource name="HostingServiceType" />
    </Admin>
  );
}

export default App;
