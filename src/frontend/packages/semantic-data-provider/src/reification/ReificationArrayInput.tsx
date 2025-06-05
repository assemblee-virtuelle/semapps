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

const ReificationArrayInput = (props: any) => {
  const { reificationClass, children, ...otherProps } = props;
  // @ts-expect-error TS(2349): This expression is not callable.
  const flexFormClasses = useReferenceInputStyles();
  // @ts-expect-error TS(2349): This expression is not callable.
  const hideInputStyles = useHideInputStyles();

  return (
    <ArrayInput {...otherProps}>
      <SimpleFormIterator
        // @ts-expect-error TS(2322): Type '{ children: any[]; classes: { form: any; }; ... Remove this comment to see the full error message
        classes={{ form: flexFormClasses.form }}
      >
        {React.Children.map(props.children, (child, i) => {
          return React.cloneElement(child, {
            className: flexFormClasses.input
          });
        })}
        <TextInput
          className={hideInputStyles.root}
          source="type"
          // @ts-expect-error TS(2322): Type '{ className: any; source: string; initialVal... Remove this comment to see the full error message
          initialValue={reificationClass}
        />
      </SimpleFormIterator>
    </ArrayInput>
  );
};

export default ReificationArrayInput;
