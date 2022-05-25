import React, {useCallback, useState} from 'react';
import { Form } from 'react-final-form';
import { useCreate, useCreateSuggestionContext} from 'react-admin';
import { Button, Dialog, DialogActions, DialogContent } from '@material-ui/core';
import LexiconAutocompleteInput from "../inputs/LexiconAutocompleteInput";

const LexiconCreateDialog = ({ fetchLexicon, parse }) => {
  const { filter, onCancel, onCreate } = useCreateSuggestionContext();
  const [value, setValue] = useState(filter || '');
  const [create] = useCreate('Skill');

  const onSubmit = useCallback(
    ({ lexicon }) => {
      if( !lexicon.uri ) delete lexicon.summary;
      create(
        {
          payload: {
            data: parse(lexicon),
          },
        },
        {
          onSuccess: ({ data }) => {
            setValue('');
            onCreate(data);
          },
        }
      );
    },
    [create, onCreate, parse]
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
              <Button variant="contained" color="primary" type="submit" disabled={!dirtyFields.lexicon}>Ajouter</Button>
            </DialogActions>
          </form>
        )}
      />
    </Dialog>
  );
};

export default LexiconCreateDialog;
