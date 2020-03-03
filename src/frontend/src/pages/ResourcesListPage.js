import React, { useState, useEffect } from 'react';
import { Link } from '@reach/router';
import useQuery from '../api/useQuery';
import ResourcePreview from '../ResourcePreview';
import resourcesTypes from '../resourcesTypes';
import Page from '../Page';
import { Form, Field } from 'react-final-form';
import { MIDDLEWARE_URL } from '../config';
import { computeSparqlSearch } from '../utils';

const ResourcesListPage = ({ type }) => {
  const [typeState, setTypeState] = useState(type);
  const [search, setSearch] = useState();
  const resourceConfig = resourcesTypes[typeState];
  const [body, setBody] = useState(computeSparql({ resourceConfig: resourcesTypes[type] }));
  const uri = MIDDLEWARE_URL + 'sparql/';

  useEffect(() => {
    setBody(computeSparqlSearch({ resourceConfig: resourcesTypes[type] }));
    setSearch(undefined);
    setTypeState(type);
  }, [type]);

  const { data } = useQuery(uri, {
    body: body,
    method: 'POST'
  });

  const searchSubmit = async values => {
    let newRequest;
    setSearch(values.searchInput);
    newRequest = computeSparqlSearch({ resourceConfig: resourcesTypes[type], search: values.searchInput });
    setBody(newRequest);
  };

  return (
    <Page>
      <h2 className="mb-3">
        {resourceConfig.name}
        {!resourceConfig.readOnly && (
          <Link to={`/resources/${type}/create`}>
            <button className="btn btn-primary pull-right">
              <i className="fa fa-plus-circle" />
              &nbsp; Ajouter
            </button>
          </Link>
        )}
      </h2>
      <Form
        onSubmit={searchSubmit}
        initialValues={{ searchInput: search }}
        render={({ handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <div className="input-group mb-3">
              <Field
                name="searchInput"
                component="input"
                type="text"
                className="form-control"
                id="searchInput"
                value={search}
              />
              <div className="input-group-append" id="button-addon4">
                <button className="btn btn-primary" type="submit">
                  <i className="fa fa-search" />
                  &nbsp; Rechercher
                </button>
              </div>
            </div>
          </form>
        )}
      />
      {data &&
        data.map(resourceUri => (
          <div key={resourceUri}>
            <ResourcePreview resourceUri={resourceUri} type={typeState} /> <br />
          </div>
        ))}
    </Page>
  );
};

export default ResourcesListPage;
