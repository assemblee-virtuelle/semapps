import React from 'react';
import { MIDDLEWARE_URL } from './config';

export const getResourceId = (uri, type) => {
  const baseUri = MIDDLEWARE_URL + 'ldp/object';
  const pattern = `${baseUri.replace(/\//g, '\\/')}\\/(.*)`;
  const matches = uri.match(new RegExp(pattern));
  return matches[1];
};

export const nl2br = str => {
  const newlineRegex = /(\r\n|\r|\n)/g;

  if (typeof str === 'number') {
    return str;
  } else if (typeof str !== 'string') {
    return '';
  }

  return str.split(newlineRegex).map(function(line, index) {
    if (line.match(newlineRegex)) {
      return React.createElement('br', { key: index });
    }
    return line;
  });
};

export const getInitialValues = (fields, data) => {
  let initialValues = {};
  fields.forEach(field => {
    let value = data[field.type] || data[field.type.split(':')[1]];
    if (typeof value === 'object') value = value['@id'];
    initialValues[field.type.split(':')[1]] = value;
  });
  return initialValues;
};
