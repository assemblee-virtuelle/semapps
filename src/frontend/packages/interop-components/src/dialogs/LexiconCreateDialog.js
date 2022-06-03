import React, { useCallback, useState } from 'react';
import { Form } from 'react-final-form';
import { useCreate, useCreateSuggestionContext, useResourceContext } from 'react-admin';
import { Button, Dialog, DialogActions, DialogContent } from '@material-ui/core';
import LexiconAutocompleteInput from '../inputs/LexiconAutocompleteInput';

const LexiconCreateDialog = ({ fetchLexicon, selectData }) => {
  const { filter, onCancel, onCreate } = useCreateSuggestionContext();
  const resource = useResourceContext();
  const [value, setValue] = useState(filter || '');
  const [create] = useCreate(resource);

  const onSubmit = useCallback(
    ({ lexicon }) => {
      // If we have no URI, it means we are creating a new definition
      // Delete the summary as it is "Ajouter XXX au dictionaire"
      if (!lexicon.uri) delete lexicon.summary;
      create(
        {
          payload: {
            data: selectData(lexicon)
          }
        },
        {
          onSuccess: ({ data }) => {
            setValue('');
            onCreate(data);
          }
        }
      );
    },
    [create, onCreate, selectData]
  );

  return (
    <Dialog open onClose={onCancel} fullWidth maxWidth="sm">
      <Form
        onSubmit={onSubmit}
        render={({ handleSubmit, dirtyFields }) => (
          <form onSubmit={handleSubmit}>
            <DialogContent>
              <LexiconAutocompleteInput
                label="Titre"
                source="lexicon"
                initialValue={value}
                fetchLexicon={fetchLexicon}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={onCancel}>Annuler</Button>
              <Button variant="contained" color="primary" type="submit" disabled={!dirtyFields.lexicon}>
                Ajouter
              </Button>
            </DialogActions>
          </form>
        )}
      />
    </Dialog>
  );
};

export default LexiconCreateDialog;
