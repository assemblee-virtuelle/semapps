import React from 'react';
import {ImageInput, SimpleForm, TextInput} from 'react-admin';
import { Edit } from '@semapps/archipelago-layout';
import { ActivitiesInput, OrganizationsInput, SkillsInput, ThemesInput } from "../../inputs";
import {ImageField} from "@semapps/semantic-data-provider";

export const UserEdit = props => (
  <Edit {...props}>
    <SimpleForm redirect="show">
      <TextInput source="pair:firstName" label="Prénom" fullWidth />
      <TextInput source="pair:lastName" label="Nom de famille" fullWidth />
      <ImageInput source="image" label="Photo" accept="image/*">
        <ImageField source="src" />
      </ImageInput>
      <ActivitiesInput label="Participe à" source="pair:involvedIn" />
      <OrganizationsInput label="Organisations" source="pair:affiliatedBy" />
      <SkillsInput label="Compétences" source="pair:offers" />
      <ThemesInput label="Intérêts" source="pair:hasTopic" />
    </SimpleForm>
  </Edit>
);

export default UserEdit;
