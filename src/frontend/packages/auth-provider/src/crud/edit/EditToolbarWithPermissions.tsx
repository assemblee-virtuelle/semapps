import React from 'react';
import { SaveButton, Toolbar, ToolbarProps } from 'react-admin';
import { styled } from '@mui/material/styles';
import DeleteButtonWithPermissions from './DeleteButtonWithPermissions';

const StyledToolbar = styled(Toolbar)(() => ({
  flex: 1,
  display: 'flex',
  justifyContent: 'space-between'
}));

const EditToolbarWithPermissions: React.FunctionComponent<ToolbarProps> = props => (
  <StyledToolbar {...props}>
    <SaveButton />
    <DeleteButtonWithPermissions />
  </StyledToolbar>
);

export default EditToolbarWithPermissions;
