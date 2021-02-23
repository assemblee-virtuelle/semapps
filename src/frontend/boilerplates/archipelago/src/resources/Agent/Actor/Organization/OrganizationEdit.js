import React, { useEffect } from 'react';
import {
  SimpleForm,
  TextInput,
  ImageInput,
  ArrayInput,
  SimpleFormIterator,
  ReferenceInput,
  AutocompleteInput,
  SelectInput
} from 'react-admin';
import MarkdownInput from 'ra-input-markdown';
import { Edit } from '@semapps/archipelago-layout';
import { ImageField,CompositArrayInput } from '@semapps/semantic-data-provider';
import { UsersInput, OrganizationsInput, EventsInput, ThemesInput, DocumentsInput } from '../../../../inputs';
import OrganizationTitle from './OrganizationTitle';
import { makeStyles } from '@material-ui/core/styles';


const MyArrayInput = (props) => {
  const newProps={...props}
  if(!Array.isArray(props.record[props.source])){
     newProps.record[props.source]=[newProps.record[newProps.source]]
  }
  for (let relation of newProps.record[newProps.source]){
    relation['@type']='pair:MembershipAssociation';
  }

  return (
    <ArrayInput {...newProps}>
    </ArrayInput>
  );
}

const useReferenceInputStyles = makeStyles({
    form: {
        display: 'flex',
    },
    container:{
      paddingRight :'20px',
    }
});



export const OrganizationEdit = props =>{
  const flexFormClasses = useReferenceInputStyles();
  return  <Edit title={<OrganizationTitle />} {...props}>
      <SimpleForm redirect="show">
        <TextInput source="pair:label" />
        <TextInput source="pair:comment" fullWidth />
        <MarkdownInput multiline source="pair:description" fullWidth />
        <TextInput source="pair:homePage" fullWidth />
        <ImageInput source="image" accept="image/*">
          <ImageField source="src" />
        </ImageInput>
        <UsersInput source="pair:affiliates" />
        <MyArrayInput label="Membres avec Role" source="pair:organizationOfMembership">
          <SimpleFormIterator classes={flexFormClasses}>
            <ReferenceInput classes={flexFormClasses} label="membre" reference="Person" source="pair:membershipActor">
              <AutocompleteInput optionText="pair:lastName" allowEmpty />
            </ReferenceInput>
            <ReferenceInput classes={flexFormClasses} label="role" reference="MembershipRole" source="pair:membershipRole">
              <SelectInput
                optionText="pair:label"
                shouldRenderSuggestions={value => value && value.length > 1}
                fullWidth
              />
            </ReferenceInput>
          </SimpleFormIterator>
        </MyArrayInput>
        <OrganizationsInput source="pair:partnerOf" />
        <EventsInput source="pair:involvedIn" />
        <ThemesInput source="pair:hasTopic" />
        <DocumentsInput source="pair:documentedBy" />
      </SimpleForm>
    </Edit>
};

export default OrganizationEdit;
