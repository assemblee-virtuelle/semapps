import React, { useState } from 'react';
import { SimpleForm } from 'react-admin';
import { Box, Tabs, Tab, Divider, useMediaQuery, makeStyles } from '@mui/material';
import ImportForm from './ImportForm';

const useStyles = makeStyles(() => ({
  tab: {
    maxWidth: 'unset',
    padding: '6px 24px'
  }
}));

const CreateOrImportForm = ({
  stripProperties,
  ...rest
}: any) => {
  const [tab, setTab] = useState(0);
  // @ts-expect-error TS(2349): This expression is not callable.
  const classes = useStyles();
  const xs = useMediaQuery(theme => theme.breakpoints.down('sm'), { noSsr: true });
  return (
    <>
      <Box pb={2}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} indicatorColor="primary">
          <Tab className={classes.tab} label="Créer" />
          <Tab className={classes.tab} label={xs ? 'Importer' : 'Importer une ressource distante'} />
        </Tabs>
        <Divider />
      </Box>
      {tab === 0 && <SimpleForm {...rest} />}
      {tab === 1 && <ImportForm stripProperties={stripProperties || []} {...rest} />}
    </>
  );
};

export default CreateOrImportForm;
