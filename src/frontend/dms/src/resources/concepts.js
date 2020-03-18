import React from 'react';
import {
  List,
  Datagrid,
  useAuthenticated
} from 'react-admin';
import Icon from '@material-ui/icons/Toys';
import { StringField } from '../utils/jsonLdInputs';

export const ConceptIcon = Icon;

export const ConceptList = (props) => {
  useAuthenticated();
  return (
    <List title="Concepts" {...props}>
      <Datagrid>
        <StringField source="skos:prefLabel" label="Nom" />
      </Datagrid>
    </List>
  );
};
