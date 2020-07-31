import React from "react";
import {AutocompleteArrayInput, Edit, SimpleForm, TextInput} from "react-admin";
import {JsonLdReferenceInput, UriInput} from "@semapps/react-admin";

const OrganizationTitle = ({ record }) => {
  return <span>Organisation {record ? `"${record['label']}"` : ''}</span>;
};

export const OrganizationEdit = props => (
  <Edit title={<OrganizationTitle />} {...props}>
    <SimpleForm>
      <TextInput source="label" label="Nom" />
      <TextInput source="comment" label="Commentaire" fullWidth />
      <MarkdownInput multiline source="description" label="Description" fullWidth />
      <UriInput source="aboutPage" label="Site web" fullWidth />
      <TextInput source="adress" label="Adresse" fullWidth />
      <TextInput source="adressLine2" label="Adresse (suite)" fullWidth />
      <JsonLdReferenceInput label="Responsables" reference="Person" source="hasResponsible">
        <AutocompleteArrayInput
          optionText={record => `${record['firstName']} ${record['lastName']}`}
          fullWidth
        />
      </JsonLdReferenceInput>
      <JsonLdReferenceInput label="Membres" reference="Person" source="hasMember">
        <AutocompleteArrayInput
          optionText={record => record && `${record['firstName']} ${record['lastName']}`}
          fullWidth
        />
      </JsonLdReferenceInput>
      <JsonLdReferenceInput label="Partenaires" reference="Agent" source="isPartnerOf">
        <AutocompleteArrayInput
          optionText={record =>
            (record && `${record['firstName']} ${record['lastName']}`) || 'LABEL MANQUANT'
          }
          fullWidth
        />
      </JsonLdReferenceInput>
      <JsonLdReferenceInput label="Intérêts" reference="Thema" source="hasInterest">
        <AutocompleteArrayInput
          optionText={record => (record && record['label']) || 'LABEL MANQUANT'}
          fullWidth
        />
      </JsonLdReferenceInput>
    </SimpleForm>
  </Edit>
);

export default OrganizationEdit;
