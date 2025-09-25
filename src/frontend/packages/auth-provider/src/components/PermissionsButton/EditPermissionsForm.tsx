import React from 'react';
import { List } from '@mui/material';
import { styled } from '@mui/system';
import AgentItem from './AgentItem';

const StyledList = styled(List)(({ theme }) => ({
  width: '100%',
  maxWidth: '100%',
  backgroundColor: theme.palette.background.paper
}));

const EditPermissionsForm = ({
  isContainer,
  agents,
  addPermission,
  removePermission
}: any) => {
  return (
    <StyledList dense>
      {Object.entries(agents).map(([agentId, agent]) => (
        <AgentItem
          key={agentId}
          isContainer={isContainer}
          agent={agent}
          addPermission={addPermission}
          removePermission={removePermission}
        />
      ))}
    </StyledList>
  );
};

export default EditPermissionsForm;
