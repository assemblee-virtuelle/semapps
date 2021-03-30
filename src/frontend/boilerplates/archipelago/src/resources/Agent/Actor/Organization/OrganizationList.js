import React from 'react';
import { MultiViewsList, SimpleList } from '@semapps/archipelago-layout';
import { MapList } from '@semapps/geo-components';
import { Avatar } from '@material-ui/core';
import MapIcon from '@material-ui/icons/Map';
import ListIcon from '@material-ui/icons/List';
import HomeIcon from '@material-ui/icons/Home';
import OrganizationFilterSidebar from "./OrganizationFilterSidebar";

const OrganizationList = props => (
  <MultiViewsList aside={<OrganizationFilterSidebar />}
    views={{
      list: {
        label: 'Liste',
        icon: ListIcon,
        sort: { field: 'pair:label', order: 'DESC' },
        perPage: 25,
        list: (
          <SimpleList
            primaryText={record => record['pair:label']}
            secondaryText={record => record['pair:comment']}
            leftAvatar={record => (
              <Avatar src={record['image']} width="100%">
                <HomeIcon />
              </Avatar>
            )}
            linkType="show"
          />
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
