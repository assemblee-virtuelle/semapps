import React, { useCallback } from 'react';
import { FormInput, TextInput, RadioButtonGroupInput } from 'react-admin';
import { Form } from 'react-final-form';
import createDecorator from 'final-form-calculate';
import { Box, Toolbar, makeStyles, Button } from '@material-ui/core';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import { ReferenceInput, useContainers } from '@semapps/semantic-data-provider';
import { MultiServerAutocompleteInput } from '@semapps/input-components';
import useFork from '../hooks/useFork';
import useSync from '../hooks/useSync';

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

const decorator = createDecorator(
  {
    field: 'remoteUri',
    updates: value => {
      if (value) {
        return { plainUri: value };
      }
      return {};
    }
  },
  {
    field: 'plainUri',
    updates: (value, name, allValues) => {
      if (value !== allValues.remoteUri) {
        return { remoteUri: null };
      }
      return {};
    }
  }
);

const ImportForm = ({ basePath, record, resource, stripProperties }) => {
  const classes = useStyles();
  const containers = useContainers(resource, '@remote');
  const fork = useFork(resource);
  const sync = useSync(resource);

  const onSubmit = useCallback(
    async ({ plainUri, method }) => {
      if (method === 'fork') {
        await fork(plainUri, stripProperties);
      } else {
        await sync(plainUri);
      }
    },
    [fork, sync, stripProperties]
  );

  return (
    <Form
      onSubmit={onSubmit}
      decorators={[decorator]}
      initialValues={{ method: 'sync' }}
      render={({ handleSubmit, dirtyFields }) => (
        <form onSubmit={handleSubmit}>
          <Box m="1em">
            {containers && Object.keys(containers).length > 0 && (
              <FormInput
                input={
                  <ReferenceInput
                    source="remoteUri"
                    label="Rechercher..."
                    reference={resource}
                    filter={{ _servers: '@remote' }}
                    enableGetChoices={({ q }) => !!(q && q.length > 1)}
                    fullWidth
                  >
                    <MultiServerAutocompleteInput
                      optionText="pair:label"
                      shouldRenderSuggestions={value => value.length > 1}
                      resettable
                    />
                  </ReferenceInput>
                }
                basePath={basePath}
                record={record}
                resource={resource}
                variant="filled"
                margin="dense"
              />
            )}
            <FormInput
              input={<TextInput source="plainUri" label="URL de la ressource distante" fullWidth />}
              basePath={basePath}
              record={record}
              resource={resource}
              variant="filled"
              margin="dense"
            />
            <FormInput
              input={
                <RadioButtonGroupInput
                  source="method"
                  label="Méthode d'importation"
                  choices={[
                    { id: 'sync', name: 'Garder la ressource locale synchronisée avec la ressource distante' },
                    { id: 'fork', name: 'Créer une nouvelle version de la ressource (fork)' }
                  ]}
                />
              }
              basePath={basePath}
              record={record}
              resource={resource}
              variant="filled"
              margin="dense"
            />
          </Box>
          <Toolbar className={classes.toolbar}>
            <Button
              type="submit"
              startIcon={<SaveAltIcon />}
              variant="contained"
              color="primary"
              disabled={!dirtyFields.plainUri}
            >
              Importer
            </Button>
          </Toolbar>
        </form>
      )}
    />
  );
};

export default ImportForm;
