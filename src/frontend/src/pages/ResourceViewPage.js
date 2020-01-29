import React from 'react';
import { Link } from '@reach/router';
import useQuery from '../api/useQuery';
import Page from '../Page';
import resourcesTypes from '../resourcesTypes';
import ResourceValue from '../ResourceValue';
import Inbox from '../Inbox';

const ResourceViewPage = ({ type, resourceId }) => {
  const resourceConfig = resourcesTypes[type];
  const resourceUri = `${resourceConfig.container}/${resourceId}`;
  const { data } = useQuery(resourceUri);

  return (
    <Page>
      {data && (
        <>
          <h2>{resourceConfig.name} > Voir</h2>
          <ul className="list-group">
            {resourceConfig.fields.map((field, i) => {
              let value = data[field.type] || data[field.type.split(':')[1]];
              if (typeof value === 'object') value = value['@id'];
              if (value) {
                return (
                  <div className="list-group-item" key={i}>
                    <div>
                      <strong>{field.label}</strong>
                    </div>
                    <div>
                      <ResourceValue field={field}>{value}</ResourceValue>
                    </div>
                  </div>
                );
              } else {
                return null;
              }
            })}
          </ul>
          {!resourceConfig.readOnly && (
            <>
              <br />
              <Link to={`/resources/${type}/${resourceId}/edit`}>
                <button type="submit" className="btn btn-warning">
                  Modifier
                </button>
              </Link>
              &nbsp; &nbsp;
              <Link to={`/resources/${type}/${resourceId}/delete`}>
                <button type="submit" className="btn btn-danger">
                  Effacer
                </button>
              </Link>
            </>
          )}
        </>
      )}
      {data && type === 'users' && (
        <>
          <br />
          <Inbox userUri={resourceUri} inboxUri={data.inbox || data['http://www.w3.org/ns/ldp#inbox']['@id']} />
        </>
      )}
    </Page>
  );
};

export default ResourceViewPage;
