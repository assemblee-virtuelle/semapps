import React, { useState, useCallback } from 'react';
import {
  Button,
  useDataProvider,
  useTranslate,
  useRefresh,
  useNotify,
  useGetResourceLabel,
  useShowContext
} from 'react-admin';
import { Dialog, DialogTitle, TextField, DialogContent, DialogActions } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { useForm } from 'react-hook-form';
import AddIcon from '@mui/icons-material/Add';
import { useDataModel } from '@semapps/semantic-data-provider';
import ResultsList from './ResultsList';

const useStyles = makeStyles(() => ({
  title: {
    paddingBottom: 8
  },
  actions: {
    padding: 15
  },
  addForm: {
    paddingTop: 0
  },
  listForm: {
    paddingLeft: 8,
    paddingRight: 8,
    paddingTop: 0,
    paddingBottom: 0,
    maxHeight: 210
  }
}));

const QuickAppendDialog = ({ open, onClose, subjectUri, source, reference }: any) => {
  const classes = useStyles();
  const { resource } = useShowContext();
  const [keyword, setKeyword] = useState('');
  const [panel, setPanel] = useState('find');
  const dataProvider = useDataProvider();
  const translate = useTranslate();
  const refresh = useRefresh();
  const notify = useNotify();
  const getResourceLabel = useGetResourceLabel();
  const dataModel = useDataModel(reference);
  const { register, setValue, handleSubmit } = useForm();

  const appendLink = useCallback(
    async (objectUri: any) => {
      // Get the freshest data so that the put operation doesn't overwrite anything
      const { data } = await dataProvider.getOne(resource, { id: subjectUri });

      await dataProvider.update(resource, {
        id: subjectUri,
        data: {
          ...data,
          [source]: data[source]
            ? Array.isArray(data[source])
              ? [...data[source], objectUri]
              : [data[source], objectUri]
            : objectUri
        },
        previousData: data
      });

      refresh();

      onClose();
    },
    [dataProvider, subjectUri, resource, source, refresh, onClose]
  );

  const create = useCallback(
    async (values: any) => {
      const { data } = await dataProvider.create(reference, {
        data: {
          // @ts-expect-error TS(2532): Object is possibly 'undefined'.
          [dataModel.fieldsMapping.title]: values.title
        }
      });

      await appendLink(data.id);

      notify(`La resource "${values.title}" a été créée`, { type: 'success' });
    },
    [dataProvider, dataModel, appendLink, reference, notify]
  );

  return (
    <Dialog fullWidth open={open} onClose={onClose}>
      {panel === 'find' ? (
        <>
          <DialogTitle className={classes.title}>Ajouter une relation</DialogTitle>
          <DialogContent className={classes.addForm}>
            <TextField
              autoFocus
              label={`Rechercher ou créer des ${getResourceLabel(reference, 2).toLowerCase()}`}
              variant="filled"
              margin="dense"
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              fullWidth
            />
          </DialogContent>
          <DialogContent className={classes.listForm}>
            <ResultsList
              keyword={keyword}
              source={source}
              reference={reference}
              appendLink={appendLink}
              switchToCreate={() => {
                setValue('title', keyword);
                setPanel('create');
              }}
            />
          </DialogContent>
          <DialogActions className={classes.actions}>
            <Button label="ra.action.close" variant="text" onClick={onClose} />
          </DialogActions>
        </>
      ) : (
        <form onSubmit={handleSubmit(create)}>
          <DialogTitle className={classes.title}>
            {translate('ra.page.create', { name: getResourceLabel(reference, 1) })}
          </DialogTitle>
          <DialogContent className={classes.addForm}>
            <TextField {...register('title')} autoFocus label="Titre" variant="filled" margin="dense" fullWidth />
          </DialogContent>
          <DialogActions className={classes.actions}>
            <Button label="ra.action.create" variant="contained" startIcon={<AddIcon />} type="submit" />
            <Button label="ra.action.close" variant="text" onClick={onClose} />
          </DialogActions>
        </form>
      )}
    </Dialog>
  );
};

export default QuickAppendDialog;
