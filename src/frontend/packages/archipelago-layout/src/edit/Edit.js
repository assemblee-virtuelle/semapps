import React from 'react';
import { Edit as RaEdit } from 'react-admin';
import EditActions from './EditActions';

const Edit = ({ actions, ...rest }) => <RaEdit actions={React.cloneElement(actions, rest)} {...rest} />;

Edit.defaultProps = {
  actions: <EditActions />
};

export default Edit;
