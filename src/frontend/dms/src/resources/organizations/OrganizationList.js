import React from 'react';
import { List, SimpleList } from 'react-admin';

export const OrganizationList = props => (
  <List title="Organisations" perPage={25} {...props}>
    <SimpleList
      primaryText={record => record.label}
      secondaryText={record => record.comment}
      leftAvatar={() => <img src={process.env.PUBLIC_URL + '/av.png'} width="100%" alt="Assemblée virtuelle" />}
      linkType="show"
    />
  </List>
);

export default OrganizationList;
