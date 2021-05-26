import React from 'react';
import { SimpleList } from '@semapps/archipelago-layout';
import { ListWithPermissions } from '@semapps/auth-provider';
import DescriptionIcon from '@material-ui/icons/Description';

const DocumentList = props => (
  <ListWithPermissions {...props}>
    <SimpleList primaryText={record => record['pair:label']} leftAvatar={() => <DescriptionIcon />} linkType="show" />
  </ListWithPermissions>
);

export default DocumentList;
