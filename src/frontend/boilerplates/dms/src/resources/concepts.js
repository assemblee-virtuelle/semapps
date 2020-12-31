import React from 'react';
import { List, Datagrid } from 'react-admin';
import Icon from '@material-ui/icons/Toys';
import { StringField } from '@semapps/react-admin';

export const ConceptIcon = Icon;

export const ConceptList = props => (
  <List title="Concepts" {...props}>
    <Datagrid>
      <StringField source="skos:prefLabel" label="Nom" />
    </Datagrid>
  </List>
);
