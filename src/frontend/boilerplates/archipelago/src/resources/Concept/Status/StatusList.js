import React from 'react';
import { SimpleList } from '@semapps/archipelago-layout';
import { ListWithPermissions } from '@semapps/auth-provider';
import VisibilityIcon from '@material-ui/icons/Visibility';

const StatusList = props => (
  <ListWithPermissions {...props}>
    <SimpleList
      primaryText={record => record['pair:label']}
      secondaryText={record => record.type}
      leftAvatar={() => <VisibilityIcon />}
    />
  </ListWithPermissions>
);

export default StatusList;
