import React from 'react';
import { nl2br } from './utils';

const ResourceValue = ({ field, children }) => {
  switch (field.datatype) {
    case 'string':
      return children;
    case 'text':
      return nl2br(children);
    case 'url':
      return (
        <a href={children} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      );
    case 'email':
      return <a href={`mailto:${children}`}>{children}</a>;
    default:
      throw new Error('Unknown datatype: ' + field.datatype);
  }
};

export default ResourceValue;
