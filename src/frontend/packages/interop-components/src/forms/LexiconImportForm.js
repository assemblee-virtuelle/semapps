import React, { useCallback } from 'react';
import { required, useTheme } from 'react-admin';
import { Form } from 'react-final-form';
import { Box, Toolbar, Button } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import LexiconAutocompleteInput from '../inputs/LexiconAutocompleteInput';
import { styled } from '@mui/system';

const StyledToolbar = styled(Toolbar)(() => { const [theme] = useTheme(); return ({
  backgroundColor: theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
  marginTop: theme.spacing(2)
})});
/*
const StyledField = styled(Field)(() => { const [theme] = useTheme(); return ({
  marginBottom: 23,
  minWidth: theme.spacing(20)
})});
*/
const LexiconImportForm = ({ resource, fetchLexicon, selectData, redirect, save, saving, ...rest }) => {
  const onSubmit = useCallback(
    async ({ lexicon }) => {
      // If we have no URI, it means we are creating a new definition
      // Delete the summary as it is "Ajouter XXX au dictionaire"
      if (!lexicon.uri) delete lexicon.summary;

      // If the user doesn't select any option, use the text as the label
      if (typeof lexicon === 'string') {
        lexicon = { label : lexicon };
      }

      await save(selectData(lexicon), redirect);
    },
    [selectData, save, redirect]
  );

  return (
    <Form
      onSubmit={onSubmit}
      render={({ handleSubmit, dirtyFields }) => (
        <form onSubmit={handleSubmit}>
          <Box m="1em">
            <LexiconAutocompleteInput label="Titre" source="lexicon" fetchLexicon={fetchLexicon} validate={required()} />
          </Box>
          <StyledToolbar>
            <Button
              type="submit"
              startIcon={<SaveIcon />}
              variant="contained"
              color="primary"
              disabled={!dirtyFields.lexicon}
            >
              Créer
            </Button>
          </StyledToolbar>
        </form>
      )}
    />
  );
};

export default LexiconImportForm;
