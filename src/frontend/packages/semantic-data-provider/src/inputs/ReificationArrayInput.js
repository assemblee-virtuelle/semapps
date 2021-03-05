import React, { useEffect, useState } from 'react';
import { ArrayInput, SimpleFormIterator, TextInput } from 'react-admin';
import { makeStyles } from '@material-ui/core/styles';

const useReferenceInputStyles = makeStyles({
  form: {
    display: 'flex'
  },
  container: {
    paddingRight: '20px'
  },
  input: {
    paddingRight: '20px'
  }
});

const useHideInputStyles = makeStyles({
  root: {
    display: 'none'
  }
});

const ReificationArrayInput = props => {

  const { reificationClass, children, ...otherProps } = props;
  const flexFormClasses = useReferenceInputStyles();
  const hideInputStyles = useHideInputStyles();

  return (
    <ArrayInput {...otherProps}>
      <SimpleFormIterator classes={flexFormClasses}>
        {React.Children.map(props.children, (child, i) => {
          return React.cloneElement(child, {
            classes: flexFormClasses
          });
        })}
        <TextInput classes={hideInputStyles} source="type" initialValue={reificationClass} />
      </SimpleFormIterator>
    </ArrayInput>
  );
};

export default ReificationArrayInput;
