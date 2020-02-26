import React, { useState, useEffect } from 'react';
import { Link } from '@reach/router';
import useQuery from '../api/useQuery';
import ResourcePreview from '../ResourcePreview';
import resourcesTypes from '../resourcesTypes';
import Page from '../Page';
import { Form, Field } from 'react-final-form';

const ResourcesListPage = ({ type }) => {
  const [typeState, setTypeState] = useState();
  const [body, setBody] = useState();
  const resourceConfig = resourcesTypes[typeState];
  const uri = 'http://localhost:3000/sparql/';
  const validType = type === typeState;

  useEffect(() => {
    setBody(`${computeRootSparql(resourcesTypes[type])}}`);
    setTypeState(type);
  }, [type]);

  const { data } = useQuery(uri, {
    body: body,
    method: 'POST',
    onlyArray: true
  });

  const computeRootSparql = resourceConfig => {
    const bodyRoot = `PREFIX ${resourceConfig.prefix}:<${resourceConfig.ontology}> CONSTRUCT { ?s ?p ?o} WHERE { ?s ?p ?o .  ?s a ${resourceConfig.prefix}:${resourceConfig.class}`;
    return bodyRoot;
  };

  const search = async values => {
    let newRequest;
    if (values.searchInput === undefined) {
      newRequest = `${computeRootSparql(resourceConfig)}}`;
    } else {
      newRequest = `${computeRootSparql(resourceConfig)}. FILTER regex(str(?o), "${values.searchInput}")}`;
    }
    setBody(newRequest);
  };

  return (
    <Page>
      <h2 className="mb-3">
        {resourceConfig && resourceConfig.name}
        {resourceConfig && !resourceConfig.readOnly && (
          <Link to={`/resources/${type}/create`}>
            <button className="btn btn-primary pull-right">
              <i className="fa fa-plus-circle" />
              &nbsp; Ajouter
            </button>
          </Link>
        )}
      </h2>
      <div className="mb-3">
        <Form
          onSubmit={search}
          render={({ handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <Field name="searchInput" component="input" type="text" className="form-control" id="searchInput" />
              <button type="submit" className="btn btn-primary w-100">
                Rechercher
              </button>
            </form>
          )}
        />
      </div>
      {validType &&
        data &&
        data.map(resourceUri => (
          <div key={resourceUri}>
            <ResourcePreview resourceUri={resourceUri} type={typeState} /> <br />
          </div>
        ))}
    </Page>
  );
};

export default ResourcesListPage;
