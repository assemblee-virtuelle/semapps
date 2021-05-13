import React from 'react';
import { SimpleForm, TextInput, ImageInput } from 'react-admin';
import MarkdownInput from 'ra-input-markdown';
import { Edit } from '@semapps/archipelago-layout';
import { ImageField } from '@semapps/semantic-data-provider';
import { UsersInput, EventsInput, ThemesInput, DocumentsInput } from '../../../../pair';
import GroupTitle from './GroupTitle';

export const GroupEdit = props => (
  <Edit title={<GroupTitle />} {...props}>
    <SimpleForm redirect="show">
      <TextInput source="pair:label" fullWidth />
      <TextInput source="pair:comment" fullWidth />
      <MarkdownInput multiline source="pair:description" fullWidth />
      <ImageInput source="image" accept="image/*">
        <ImageField source="src" />
      </ImageInput>
      <UsersInput source="pair:affiliates" />
      <EventsInput source="pair:involvedIn" />
      <ThemesInput source="pair:hasTopic" />
      <DocumentsInput source="pair:documentedBy" />
    </SimpleForm>
  </Edit>
);

export default GroupEdit;
