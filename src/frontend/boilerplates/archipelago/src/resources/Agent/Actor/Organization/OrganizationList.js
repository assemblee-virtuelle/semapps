import React from 'react';
import { MultiViewsList, SimpleList } from '@semapps/archipelago-layout';
import { ListWithPermissions } from '@semapps/auth-provider';
import { MapList } from '@semapps/geo-components';
import { Avatar } from '@material-ui/core';
import MapIcon from '@material-ui/icons/Map';
import ListIcon from '@material-ui/icons/List';
import HomeIcon from '@material-ui/icons/Home';
import OrganizationFilterSidebar from './OrganizationFilterSidebar';
import { Fragment } from 'react';
import { BulkDeleteButton } from 'react-admin';
import { List, Datagrid, TextField, DateField, BooleanField } from 'react-admin';


const PostBulkActionButtons = ({ basePath }) => (
  <Fragment>
      <BulkDeleteButton basePath={basePath} />
  </Fragment>
);

const OrganizationList = props => (
  <MultiViewsList
    ListComponent={ListWithPermissions}
    aside={<OrganizationFilterSidebar />}
    views={{
      list: {
        label: 'Liste',
        icon: ListIcon,
        sort: { field: 'pair:label', order: 'ASC' },
        perPage: 25,
        list: (
            <Datagrid >
              <TextField source="id" />
            </Datagrid>
        )
      },
      map: {
        label: 'Carte',
        icon: MapIcon,
        perPage: 500,
        pagination: false,
        list: (
          <MapList
            latitude={record => record['pair:hasLocation'] && record['pair:hasLocation']['pair:latitude']}
            longitude={record => record['pair:hasLocation'] && record['pair:hasLocation']['pair:longitude']}
            label={record => record['pair:label']}
            description={record => record['pair:comment']}
            scrollWheelZoom
          />
        )
      }
    }}
    {...props}
  />
);

export default OrganizationList;
