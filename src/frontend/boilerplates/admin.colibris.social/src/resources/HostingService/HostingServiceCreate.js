import React from 'react';
import { Create } from 'react-admin';
import HostingServiceForm from './HostingServiceForm';

const HostingServiceCreate = props => (
  <Create title="Créer une offre d'hébergement" {...props}>
    <HostingServiceForm />
  </Create>
);

export default HostingServiceCreate;
