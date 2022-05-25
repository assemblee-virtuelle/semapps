import React, { useCallback } from 'react';
import { Form } from 'react-final-form';
import { Box, Toolbar, makeStyles, Button } from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import LexiconAutocompleteInput from "../inputs/LexiconAutocompleteInput";

const useStyles = makeStyles(theme => ({
  toolbar: {
    backgroundColor: theme.palette.type === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
    marginTop: theme.spacing(2)
  },
  field: {
    marginBottom: 23,
    minWidth: theme.spacing(20)
  }
}));

const LexiconImportForm = ({ basePath, record, resource, fetchLexicon }) => {
  const classes = useStyles();

  const onSubmit = useCallback(
    async ({ lexicon }) => {
      console.log('lexicon', lexicon);
    },
    []
  );

  return (
    <Form
      onSubmit={onSubmit}
      render={({ handleSubmit, dirtyFields }) => (
        <form onSubmit={handleSubmit}>
          <Box m="1em">
            <LexiconAutocompleteInput
              label="Titre"
              source="lexicon"
              fetchLexicon={fetchLexicon}
            />
          </Box>
          <Toolbar className={classes.toolbar}>
            <Button
              type="submit"
              startIcon={<SaveIcon />}
              variant="contained"
              color="primary"
              disabled={!dirtyFields.lexicon}
            >
              Créer
            </Button>
          </Toolbar>
        </form>
      )}
    />
  );
};

export default LexiconImportForm;
