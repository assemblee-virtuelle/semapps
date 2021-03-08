import React from 'react';
import { List, SimpleList } from '@semapps/archipelago-layout';
import VisibilityIcon from '@material-ui/icons/Visibility';

const StatusList = props => (
  <List {...props}>
    <SimpleList primaryText={record => record['pair:label']} secondaryText={record => record.type} leftAvatar={() => <VisibilityIcon />} />
  </List>
);

export default StatusList;
