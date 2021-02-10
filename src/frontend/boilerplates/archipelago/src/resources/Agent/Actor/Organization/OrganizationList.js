import React from 'react';
import { MapList, MultiViewsList, SimpleList } from '@semapps/archipelago-layout';
import MapIcon from '@material-ui/icons/Map';
import ListIcon from '@material-ui/icons/List';

const OrganizationList = props => (
  <MultiViewsList
    views={{
      list: {
        label: 'Liste',
        icon: ListIcon,
        sort: { field: 'pair:label', order: 'DESC' },
        perPage: 25,
        list:
          <SimpleList
            primaryText={record => record['pair:label']}
            secondaryText={record => record['pair:comment']}
            leftAvatar={record => (
              <img src={record['image'] || process.env.PUBLIC_URL + '/logo192.png'} width="100%" alt="SemApps" />
            )}
            linkType="show"
          />
      },
      map: {
        label: 'Carte',
        icon: MapIcon,
        perPage: 500,
        pagination: false,
        list:
          <MapList
            latitude={record => record['pair:address'] && record['pair:address']['pair:latitude']}
            longitude={record => record['pair:address'] && record['pair:address']['pair:longitude']}
            label={record => record['pair:label']}
            description={record => record['pair:comment']}
            linkType="show"
          />
      },
    }}
    {...props}
  />
);

export default OrganizationList;
