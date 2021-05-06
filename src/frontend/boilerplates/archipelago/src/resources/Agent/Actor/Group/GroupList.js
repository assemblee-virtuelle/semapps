import React from 'react';
import { MultiViewsList, SimpleList } from '@semapps/archipelago-layout';
import ListIcon from '@material-ui/icons/List';

const GroupList = props => (
  <MultiViewsList
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
              <img src={record['image'] || process.env.PUBLIC_URL + '/logo192.png'} width="100%" alt="SemApps" />
            )}
            linkType="show"
          />
        )
      }
    }}
    {...props}
  />
);

export default GroupList;
