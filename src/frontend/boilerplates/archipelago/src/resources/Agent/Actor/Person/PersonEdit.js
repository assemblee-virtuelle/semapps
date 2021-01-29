import React from 'react';
import { ImageInput, SimpleForm, TextInput } from 'react-admin';
import { Edit } from '@semapps/archipelago-layout';
import { ActivitiesInput, OrganizationsInput, SkillsInput, ThemesInput } from '../../../../inputs';
import { ImageField } from '@semapps/semantic-data-provider';
import PersonTitle from './PersonTitle';

export const PersonEdit = props => (
  <Edit title={<PersonTitle />} {...props}>
    <SimpleForm redirect="show">
      <TextInput source="pair:firstName" fullWidth />
      <TextInput source="pair:lastName" fullWidth />
      <ImageInput source="image" accept="image/*">
        <ImageField source="src" />
      </ImageInput>
      <ActivitiesInput source="pair:involvedIn" />
      <OrganizationsInput source="pair:affiliatedBy" />
      <SkillsInput source="pair:offers" />
      <ThemesInput source="pair:hasTopic" />
    </SimpleForm>
  </Edit>
);

export default PersonEdit;
