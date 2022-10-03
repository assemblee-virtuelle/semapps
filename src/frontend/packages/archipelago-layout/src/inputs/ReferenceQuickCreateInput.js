import React, { useState } from 'react';
import { useForm } from 'react-final-form';
import {
  ReferenceInput,
  required,
  Button,
  SaveButton,
  TextInput,
  useCreate,
  useNotify,
  useTranslate,
  FormWithRedirect
} from 'react-admin';
import { Dialog, DialogTitle, DialogContent, DialogActions, makeStyles } from '@material-ui/core';
import IconContentAdd from '@material-ui/icons/Add';
import IconCancel from '@material-ui/icons/Cancel';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    alignItems: 'center'
  }
});

/**
 * @deprecated Does not work
 */
const ReferenceQuickCreateInput = ({ label, reference, source, children }) => {
  const classes = useStyles();

  const [showDialog, setShowDialog] = useState(false);
  const [create, { loading }] = useCreate(reference);
  const translate = useTranslate();
  const notify = useNotify();
  const form = useForm();

  const handleSubmit = async values => {
    create(
      { payload: { data: values } },
      {
        onSuccess: ({ data }) => {
          setShowDialog(false);
          // Update the comment form to target the newly created post
          // Updating the ReferenceInput value will force it to reload the available posts
          form.change(source, data['@id']);
        },
        onFailure: ({ error }) => {
          notify(error.message, 'error');
        }
      }
    );
  };

  return (
    <div className={classes.root}>
      <ReferenceInput label={label} reference={reference} source={source}>
        {children}
      </ReferenceInput>
      <Button onClick={() => setShowDialog(true)} label="ra.action.create">
        <IconContentAdd />
      </Button>
      <Dialog fullWidth open={showDialog} onClose={() => setShowDialog(false)}>
        <DialogTitle>{translate('ra.action.create')}</DialogTitle>
        <FormWithRedirect
          resource={reference}
          save={handleSubmit}
          render={({ handleSubmitWithRedirect, pristine, saving }) => (
            <>
              <DialogContent>
                <TextInput label="Titre" source="pair:label" validate={required()} fullWidth />
              </DialogContent>
              <DialogActions>
                <Button label="ra.action.cancel" onClick={() => setShowDialog(false)} disabled={loading}>
                  <IconCancel />
                </Button>
                <SaveButton
                  handleSubmitWithRedirect={handleSubmitWithRedirect}
                  pristine={pristine}
                  saving={saving}
                  disabled={loading}
                />
              </DialogActions>
            </>
          )}
        />
      </Dialog>
    </div>
  );
};

export default ReferenceQuickCreateInput;
