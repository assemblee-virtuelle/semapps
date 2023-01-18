import React, { useState } from 'react';
import { SimpleForm, useTheme } from 'react-admin';
import { Box, Tab, Tabs, Divider, useMediaQuery } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import ImportForm from './ImportForm';
import { styled } from '@mui/system';

const StyledTab = styled(Tab)(({ theme }) => ({
  maxWidth: 'unset',
  padding: '6px 24px'
}));

const CreateOrImportForm = ({ stripProperties, ...rest }) => {
  const [tab, setTab] = useState(0);
  const [theme] = useTheme();
  const xs = useMediaQuery(() => theme.breakpoints.down('sm'), { noSsr: true });
  return (
    <>
      <Box pb={2} fullWidth>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} indicatorColor="primary">
          <StyledTab label="Créer" />
          <StyledTab label={xs ? 'Importer' : 'Importer une ressource distante'} />
        </Tabs>
        <Divider />
      </Box>
      {tab === 0 && <SimpleForm {...rest} />}
      {tab === 1 && <ImportForm stripProperties={stripProperties || []} {...rest} />}
    </>
  );
};

export default CreateOrImportForm;
