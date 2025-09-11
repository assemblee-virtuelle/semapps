import React, { useCallback, useEffect } from 'react';
import { SimpleForm, TextInput, RadioButtonGroupInput, useResourceContext } from 'react-admin';
import { useFormContext } from 'react-hook-form';
import { useContainers, useDataModel } from '@semapps/semantic-data-provider';
import { ReferenceInput, MultiServerAutocompleteInput } from '@semapps/input-components';
import useFork from '../hooks/useFork';
import useSync from '../hooks/useSync';

const ImportFormInputs = () => {
  const resource = useResourceContext();
  const containers = useContainers(resource, '@remote');
  // @ts-expect-error TS(2345): Argument of type 'ResourceContextValue' is not ass... Remove this comment to see the full error message
  const dataModel = useDataModel(resource);

  const { watch, setValue } = useFormContext();
  const watchRemoteUri = watch('remoteUri');
  const watchPlainUri = watch('plainUri');

  useEffect(() => {
    if (watchRemoteUri) {
      setValue('plainUri', watchRemoteUri);
    }
  }, [watchRemoteUri]);

  useEffect(() => {
    if (watchPlainUri && watchPlainUri !== watchRemoteUri) {
      setValue('remoteUri', null);
    }
  }, [watchRemoteUri, watchPlainUri]);

  if (!dataModel) return null;

  return <>
    {containers && Object.keys(containers).length > 0 && (
      <ReferenceInput
        source="remoteUri"
        reference={resource}
        filter={{ _servers: '@remote', _predicates: [dataModel?.fieldsMapping?.title] }}
        enableGetChoices={({
          q
        }: any) => !!(q && q.length > 1)}
      >
        <MultiServerAutocompleteInput
          optionText={dataModel?.fieldsMapping?.title}
          shouldRenderSuggestions={(value: any) => value.length > 1}
          noOptionsText="Tapez au moins deux lettres"
          emptyText="Rechercher..."
          label="Resource distante"
          fullWidth
        />
      </ReferenceInput>
    )}
    <TextInput source="plainUri" label="URL de la ressource distante" fullWidth />
    <RadioButtonGroupInput
      source="method"
      label="Méthode d'importation"
      choices={[
        { id: 'sync', name: 'Garder la ressource locale synchronisée avec la ressource distante' },
        { id: 'fork', name: 'Créer une nouvelle version de la ressource (fork)' }
      ]}
    />
  </>;
};

const ImportForm = ({
  stripProperties
}: any) => {
  const resource = useResourceContext();
  const fork = useFork(resource);
  const sync = useSync(resource);

  const onSubmit = useCallback(
    async ({
      plainUri,
      method
    }: any) => {
      if (method === 'fork') {
        await fork(plainUri, stripProperties);
      } else {
        await sync(plainUri);
      }
    },
    [fork, sync, stripProperties]
  );

  return (
    <SimpleForm onSubmit={onSubmit} defaultValues={{ method: 'sync' }}>
      <ImportFormInputs />
    </SimpleForm>
  );
};

export default ImportForm;
