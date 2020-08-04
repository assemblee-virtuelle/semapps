import React from 'react';
import { ChipField, Show, SingleFieldList, TextField } from 'react-admin';
import ColumnShowLayout from '../../components/ColumnShowLayout';
import Column from '../../components/Column';
import Hero from '../../components/Hero';
import UriArrayField from '../../components/UriArrayField';

const UserTitle = ({ record }) => {
  return <span>{record ? `${record['pair:firstName']} ${record['pair:lastName']}` : ''}</span>;
};

const UserShow = props => (
  <Show {...props}>
    <ColumnShowLayout>
      <Column xs={9}>
        <Hero title={<UserTitle />} image={process.env.PUBLIC_URL + '/unknown-user.png'}>
          <TextField label="Prénom" source="pair:firstName" />
          <TextField label="Nom de famille" source="pair:lastName" />
        </Hero>
      </Column>
      <Column xs={3} showLabel>
        <UriArrayField label="Membre" reference="Organization" source="pair:memberOf" referenceBasePath="/Organization">
          <SingleFieldList linkType="show">
            <ChipField source="pair:label" color="secondary" />
          </SingleFieldList>
        </UriArrayField>
        <UriArrayField label="Participe à" reference="Project" source="pair:involvedIn" referenceBasePath="/Project">
          <SingleFieldList linkType="show">
            <ChipField source="pair:label" color="secondary" />
          </SingleFieldList>
        </UriArrayField>
      </Column>
    </ColumnShowLayout>
  </Show>
);

export default UserShow;
