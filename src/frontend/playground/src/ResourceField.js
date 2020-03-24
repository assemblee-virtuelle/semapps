import React from 'react';
import { Field } from 'react-final-form';

const ResourceField = ({ field }) => {
  const fieldId = field.type.split(':')[1];
  let fieldComponent;

  switch (field.datatype) {
    case 'string':
    case 'url':
      fieldComponent = <Field name={fieldId} component="input" type="text" className="form-control" id={fieldId} />;
      break;
    case 'text':
      fieldComponent = <Field name={fieldId} component="textarea" className="form-control" rows={5} id={fieldId} />;
      break;
    case 'email':
      fieldComponent = <Field name={fieldId} component="input" type="email" className="form-control" id={fieldId} />;
      break;
    default:
      throw new Error('Unknown datatype: ' + field.datatype);
  }

  return (
    <div className="form-group">
      <label htmlFor={fieldId}>{field.label}</label>
      {fieldComponent}
    </div>
  );
};

export default ResourceField;
