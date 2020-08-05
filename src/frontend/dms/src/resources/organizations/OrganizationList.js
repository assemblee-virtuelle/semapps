import React from 'react';
import { List, SimpleList } from 'react-admin';
import { ResourceTabs } from '../../archipelago-layout';

const OrganizationList = props => (
  <List title="Organisations" perPage={25} {...props}>
    <>
      <ResourceTabs />
      <SimpleList
        primaryText={record => record['pair:label']}
        secondaryText={record => record['pair:comment']}
        leftAvatar={() => <img src={process.env.PUBLIC_URL + '/av.png'} width="100%" alt="Assemblée virtuelle" />}
        linkType="show"
      />
    </>
  </List>
);

export default OrganizationList;
