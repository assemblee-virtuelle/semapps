import React from 'react';
import { Edit as RaEdit } from 'react-admin';
import EditActions from './EditActions';

const Edit = props => <RaEdit actions={<EditActions />} {...props} />;

export default Edit;
