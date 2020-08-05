import React from 'react';
import { Create, SimpleForm, TextInput } from 'react-admin';

const SkillCreate = props => (
  <Create title="Créer une compétence" {...props}>
    <SimpleForm>
      <TextInput source="pair:label" label="Titre" />
    </SimpleForm>
  </Create>
);

export default SkillCreate;
