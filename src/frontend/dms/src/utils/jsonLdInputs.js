import React from 'react';
import { SimpleForm, ReferenceArrayInput, AutocompleteArrayInput } from 'react-admin';

/*
 * Understand automatically the input value either as an URL, or an object with an @id property
 * Automatically use the preferedLabel value as the option text
 */
const JsonLdAutocompleteInput = props => (
  <AutocompleteArrayInput
    {...props}
    input={{ ...props.input, value: props.input.value && props.input.value.map(v => typeof v === 'object' ? v['@id'] : v)}}
    optionText={record => ( record && record['pair:preferedLabel'] ) || 'LABEL MANQUANT'}
    fullWidth
  />
);

/*
 * Redefines the ReferenceArrayInput component in order to be able to identify it
 */
const JsonLdReferenceInput = props => (
  <ReferenceArrayInput {...props}>
    <JsonLdAutocompleteInput />
  </ReferenceArrayInput>
);
JsonLdReferenceInput.displayName = 'JsonLdReferenceInput';

/*
 * Identifies JsonLdReferenceInput and, if the linked field value is not an array,
 * turns it into an array. This is necessary since JSON-LD values can sometimes be array,
 * sometimes not, and the ReferenceArrayInput only accept array values
 */
const JsonLdSimpleForm = ({ record, children, ...otherProps }) => {
  React.Children.forEach(children, child => {
    const childType = { ...child.type };
    if( childType.displayName === 'JsonLdReferenceInput') {
      const inputSource = child.props.source;
      if( !Array.isArray(record[inputSource]) ) {
        record[inputSource] = [record[inputSource]];
      }
    }
  });

  return <SimpleForm record={record} {...otherProps}>{children}</SimpleForm>
};

export {
  JsonLdAutocompleteInput,
  JsonLdReferenceInput,
  JsonLdSimpleForm
};
