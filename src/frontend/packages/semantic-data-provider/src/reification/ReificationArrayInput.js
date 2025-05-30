import { makeStyles } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { ArrayInput, SimpleFormIterator, TextInput } from 'react-admin';

const useReferenceInputStyles = makeStyles({
  form: {
    display: 'flex'
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
      <SimpleFormIterator classes={{ form: flexFormClasses.form }}>
        {React.Children.map(props.children, (child, i) => {
          return React.cloneElement(child, {
            className: flexFormClasses.input
          });
        })}
        <TextInput className={hideInputStyles.root} source="type" initialValue={reificationClass} />
      </SimpleFormIterator>
    </ArrayInput>
  );
};

export default ReificationArrayInput;
