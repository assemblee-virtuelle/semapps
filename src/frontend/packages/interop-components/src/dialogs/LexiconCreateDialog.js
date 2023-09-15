import React, { useCallback, useState } from 'react';
import { useCreate, useCreateSuggestionContext, useResourceContext } from 'react-admin';
import { Button, Dialog, DialogActions, DialogContent } from '@mui/material';
import LexiconAutocompleteInput from '../inputs/LexiconAutocompleteInput';

const LexiconCreateDialog = ({ fetchLexicon, selectData }) => {
  const { filter, onCancel, onCreate } = useCreateSuggestionContext();
  const resource = useResourceContext();
  const [value, setValue] = useState(filter || '');
  const [create] = useCreate();

  const onClose = useCallback(() => {
    setValue('');
    onCancel();
  }, [setValue, onCancel]);

  const onSubmit = useCallback(() => {
    // If we have no URI, it means we are creating a new definition
    // Delete the summary as it is "Ajouter XXX au dictionaire"
    if (!value.uri) delete value.summary;
    create(
      resource,
      { data: selectData(value) },
      {
        onSuccess: data => {
          console.log('onSuccess', data);
          setValue('');
          onCreate(data);
        }
      }
    );
  }, [create, onCreate, selectData, value, setValue, resource]);

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm">
      <DialogContent>
        <LexiconAutocompleteInput
          source="lexicon"
          label="Titre"
          fetchLexicon={fetchLexicon}
          defaultValue={filter}
          value={value}
          onChange={setValue}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button variant="contained" color="primary" onClick={onSubmit}>
          Ajouter
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LexiconCreateDialog;
