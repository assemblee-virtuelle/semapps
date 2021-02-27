import React, {useEffect, useState} from 'react';
import { SimpleForm, TextInput, ImageInput, ArrayInput, SimpleFormIterator,AutocompleteInput,ReferenceInput,SelectInput } from 'react-admin';
import MarkdownInput from 'ra-input-markdown';
import { Edit } from '@semapps/archipelago-layout';
import { ImageField } from '@semapps/semantic-data-provider';
import { UsersInput, OrganizationsInput, EventsInput, ThemesInput, DocumentsInput, PairLocationInput } from '../../../../pair';
import OrganizationTitle from './OrganizationTitle';
import { makeStyles } from '@material-ui/core/styles';



const useReferenceInputStyles = makeStyles({
    form: {
        display: 'flex',
    },
    container:{
      paddingRight :'20px',
    }
});

const useHideInputStyles = makeStyles({
    root: {
        display: 'none',
    },
});


const MyArrayInput = (props) => {

  // const [newProps,setNewProps] = useState();
  const {semanticClass,...otherProps} = props;

  const newProps ={...props,record:{...props.record}}

  if(newProps.record[newProps.source]===undefined){
     newProps.record[newProps.source]=[]
  }else if(!Array.isArray(props.record[props.source])){
     newProps.record[newProps.source]=[newProps.record[newProps.source]]
  }

  // useEffect(()=>{
  //   if(props.record[props.source]===undefined){
  //      props.record[props.source]=[]
  //   }else if(!Array.isArray(props.record[props.source])){
  //      props.record[props.source]=[props.record[props.source]]
  //   }
  //   // for (let relation of props.record[props.source]){
  //   //   relation['@type']=semanticClass;
  //   // }
  // },[props.record])

  console.log('RENDER',newProps.record);
  const flexFormClasses = useReferenceInputStyles();
  const hideInputStyles = useHideInputStyles();
  return (
    <ArrayInput label="Membres avec Role" source="pair:organizationOfMembership">
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
        <TextInput classes={hideInputStyles} source="type" initialValue="pair:MembershipAssociation"/>
      </SimpleFormIterator>
    </ArrayInput>
  );

}

export const OrganizationEdit = props => {
  const flexFormClasses = useReferenceInputStyles();
  const hideInputStyles = useHideInputStyles();
  // console.log(props);
  return <Edit title={<OrganizationTitle />} {...props}>
    <SimpleForm redirect="show">
      <TextInput source="pair:label" fullWidth />
      <ArrayInput label="Membres avec Role" source="pair:organizationOfMembership">
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
          <TextInput classes={hideInputStyles} source="type" initialValue="pair:MembershipAssociation"/>
        </SimpleFormIterator>
      </ArrayInput>
      <TextInput source="pair:comment" fullWidth />
      <MarkdownInput multiline source="pair:description" fullWidth />
      <TextInput source="pair:homePage" fullWidth />
      <ImageInput source="image" accept="image/*">
        <ImageField source="src" />
      </ImageInput>
      <UsersInput source="pair:affiliates" />

      <OrganizationsInput source="pair:partnerOf" />
      <EventsInput source="pair:involvedIn" />
      <ThemesInput source="pair:hasTopic" />
      <DocumentsInput source="pair:documentedBy" />
      <PairLocationInput source="pair:hasLocation" fullWidth />
    </SimpleForm>
  </Edit>
};

export default OrganizationEdit;
