import React from 'react';
import { ImageInput, TabbedForm, TextInput, FormTab } from 'react-admin';
import { EditWithPermissions } from '@semapps/auth-provider';
import { ActivitiesInput, OrganizationsInput, PairLocationInput, SkillsInput, ThemesInput } from '../../../../pair';
import { ImageField } from '@semapps/semantic-data-provider';
import PersonTitle from './PersonTitle';

export const PersonEdit = props => (
  <EditWithPermissions
    title={<PersonTitle />}
    transform={data => ({ ...data, 'pair:label': `${data['pair:firstName']} ${data['pair:lastName']?.toUpperCase()}` })}
    {...props}
  >
    <TabbedForm redirect="show">
      <FormTab label="Données">
        <TextInput source="pair:firstName" fullWidth />
        <TextInput source="pair:lastName" fullWidth />
        <TextInput source="pair:comment" fullWidth />
        <PairLocationInput source="pair:hasLocation" fullWidth />
        <ImageInput source="image" accept="image/*">
          <ImageField source="src" />
        </ImageInput>
      </FormTab>
      <FormTab label="Relations">
        <ActivitiesInput source="pair:involvedIn" />
        <OrganizationsInput source="pair:affiliatedBy" />
        <SkillsInput source="pair:offers" />
        <ThemesInput source="pair:hasTopic" />
      </FormTab>
    </TabbedForm>
  </EditWithPermissions>
);

export default PersonEdit;
