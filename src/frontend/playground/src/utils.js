import React from 'react';
import resourcesTypes from "./resourcesTypes";

export const getResourceId = (uri, type) => {
  const baseUri = resourcesTypes[type].baseUri;
  const pattern = `${baseUri.replace(/\//g, '\\/')}(.*)`;
  const matches = uri.match(new RegExp(pattern));
  return matches && matches[1];
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

export const computeSparqlSearch = ({ resourceConfig, search }) => {
  let subjectsRequest = '';
  if (search && search.length > 0) {
    subjectsRequest = `
      {
        SELECT  ?s1
        WHERE {
          ?s1 ?p1 ?o1 .
          FILTER regex(str(?o1), "${search}")
          FILTER NOT EXISTS {?s1 a ?o1}
        }
      }
      `;
  }
  return `
    PREFIX ${resourceConfig.prefix}:<${resourceConfig.ontology}>
    CONSTRUCT {?s1 ?p2 ?o2}
    WHERE{
      ${subjectsRequest}
      ?s1 a ${resourceConfig.prefix}:${resourceConfig.class}.
      ?s1 ?p2 ?o2 .
    }
  `;
};
