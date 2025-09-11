import React, { useCallback } from 'react';
import { required, SimpleForm, useSaveContext } from 'react-admin';
import LexiconAutocompleteInput from '../inputs/LexiconAutocompleteInput';

const LexiconImportForm = ({ fetchLexicon, selectData }: any) => {
  const { save } = useSaveContext();

  const onSubmit = useCallback(
    async ({ lexicon }: any) => {
      // If we have no URI, it means we are creating a new definition
      // Delete the summary as it is "Ajouter XXX au dictionaire"
      if (!lexicon.uri) delete lexicon.summary;

      // If the user doesn't select any option, use the text as the label
      if (typeof lexicon === 'string') {
        lexicon = { label: lexicon };
      }

      // @ts-expect-error TS(2722): Cannot invoke an object which is possibly 'undefin... Remove this comment to see the full error message
      await save(selectData(lexicon));
    },
    [selectData, save]
  );

  return (
    <SimpleForm onSubmit={onSubmit}>
      <LexiconAutocompleteInput
        // @ts-expect-error TS(2322): Type '{ label: string; source: string; fetchLexico... Remove this comment to see the full error message
        label="Titre"
        source="lexicon"
        fetchLexicon={fetchLexicon}
        validate={required()}
      />
    </SimpleForm>
  );
};

export default LexiconImportForm;
