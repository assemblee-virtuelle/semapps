import React, { useCallback } from 'react';
import { required, SimpleForm, useSaveContext } from 'react-admin';
import LexiconAutocompleteInput from '../inputs/LexiconAutocompleteInput';

const LexiconImportForm = ({ fetchLexicon, selectData }) => {
  const { save } = useSaveContext();

  const onSubmit = useCallback(
    async ({ lexicon }) => {
      // If we have no URI, it means we are creating a new definition
      // Delete the summary as it is "Ajouter XXX au dictionaire"
      if (!lexicon.uri) delete lexicon.summary;

      // If the user doesn't select any option, use the text as the label
      if (typeof lexicon === 'string') {
        lexicon = { label: lexicon };
      }

      await save(selectData(lexicon));
    },
    [selectData, save]
  );

  return (
    <SimpleForm onSubmit={onSubmit}>
      <LexiconAutocompleteInput label="Titre" source="lexicon" fetchLexicon={fetchLexicon} validate={required()} />
    </SimpleForm>
  );
};

export default LexiconImportForm;
