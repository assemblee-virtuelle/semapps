import React, { useState } from 'react';
import { SimpleForm } from 'react-admin';
import { Box, Tab, Tabs, Divider, makeStyles, useMediaQuery } from "@material-ui/core";
import ImportForm from "./ImportForm";

const useStyles = makeStyles(theme => ({
  tab: {
    maxWidth: 'unset',
    padding: '6px 24px'
  },
}));

const CreateOrImportForm = ({ stripProperties, ...rest }) => {
  const [tab, setTab] = useState(0);
  const xs = useMediaQuery((theme) => theme.breakpoints.down('xs'), { noSsr: true });
  const classes = useStyles();
  return (
    <>
      <Box pb={2} fullWidth>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} indicatorColor="primary">
          <Tab className={classes.tab} label="Créer" />
          <Tab className={classes.tab} label={xs ? "Importer" : "Importer une ressource distante"} />
        </Tabs>
        <Divider />
      </Box>
      {tab === 0 &&
        <SimpleForm {...rest} />
      }
      {tab === 1 &&
        <ImportForm stripProperties={stripProperties || []} {...rest} />
      }
    </>
  );
}

export default CreateOrImportForm;
