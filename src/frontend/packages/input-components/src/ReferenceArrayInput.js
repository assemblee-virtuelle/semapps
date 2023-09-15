import React, { useEffect } from 'react';
import { ReferenceArrayInput as RaReferenceArrayInput } from 'react-admin';
import { useController } from 'react-hook-form';

const ReferenceArrayInput = props => {
  const {
    field: { value, onChange }
  } = useController({ name: props.source });

  useEffect(() => {
    if (value && !Array.isArray(value)) {
      onChange([value]);
    }
  }, [value, onChange]);

  // Wait for change to be effective before rendering component
  // Otherwise it will be wrongly initialized and it won't work
  if (value && !Array.isArray(value)) return null;

  return <RaReferenceArrayInput {...props} />;
};

export default ReferenceArrayInput;
