import React, { useState, useCallback } from 'react';
import { Form, useGetIdentity, useNotify, useRecordContext } from 'react-admin';
import { RichTextInput, DefaultEditorOptions } from 'ra-input-rich-text';
import Placeholder from '@tiptap/extension-placeholder';
import { Button, Box, Avatar } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import SendIcon from '@mui/icons-material/Send';
import { useDataModel } from '@semapps/semantic-data-provider';
import { AuthDialog } from '@semapps/auth-provider';
import { OBJECT_TYPES, PUBLIC_URI } from '../../constants';
import useOutbox from '../../hooks/useOutbox';
import CustomMention from './CustomMention';

const useStyles = makeStyles((theme: any) => ({
  form: {
    marginTop: -12 // Negative margin to keep the form close to the label
  },
  container: {
    paddingLeft: 80,
    position: 'relative'
  },
  avatar: {
    position: 'absolute',
    top: 16,
    left: 0,
    bottom: 0,
    width: 64,
    height: 64
  },
  editorContent: {
    '& > div': {
      backgroundColor: 'rgba(0, 0, 0, 0.09)',
      padding: '2px 12px',
      borderWidth: '0px !important',
      borderRadius: 0,
      borderBottom: '1px solid #FFF',
      minHeight: 60,
      outline: 'unset !important'
    },
    '& > div > p': {
      marginTop: 12,
      marginBottom: 12,
      fontFamily: theme.typography.body1.fontFamily,
      marginBlockStart: '0.5em',
      marginBlockEnd: '0.5em'
    },
    '& > div > p.is-editor-empty:first-child::before': {
      color: 'grey',
      content: 'attr(data-placeholder)',
      float: 'left',
      height: 0,
      pointerEvents: 'none'
    }
  },
  button: {
    marginTop: -10, // To go over helper text block
    marginBottom: 15
  }
}));

const EmptyToolbar = () => null;

const PostCommentForm = ({ context, placeholder, helperText, mentions, userResource, addItem, removeItem }: any) => {
  const record = useRecordContext();
  const { data: identity, isLoading } = useGetIdentity();
  const userDataModel = useDataModel(userResource);
  const classes = useStyles();
  const notify = useNotify();
  const outbox = useOutbox();
  const [expanded, setExpanded] = useState(false);
  const [openAuth, setOpenAuth] = useState(false);

  const onSubmit = useCallback(
    async (values: any) => {
      const document = new DOMParser().parseFromString(values.comment, 'text/html');
      const mentions = Array.from(document.body.getElementsByClassName('mention'));
      const mentionedUsersUris: any = [];

      mentions.forEach(node => {
        // @ts-expect-error TS(7015): Element implicitly has an 'any' type because index... Remove this comment to see the full error message
        const userUri = node.attributes['data-mention-id'].value;
        // @ts-expect-error TS(7015): Element implicitly has an 'any' type because index... Remove this comment to see the full error message
        const userLabel = node.attributes['data-mention-label'].value;
        const link = document.createElement('a');
        link.setAttribute(
          'href',
          `${new URL(window.location.href).origin}/${userResource}/${encodeURIComponent(userUri)}/show`
        );
        link.textContent = `@${userLabel}`;
        // @ts-expect-error TS(2531): Object is possibly 'null'.
        node.parentNode.replaceChild(link, node);
        mentionedUsersUris.push(userUri);
      });

      if (document.body.innerHTML === 'undefined') {
        notify('Votre commentaire est vide', { type: 'error' });
      } else {
        const tempId = Date.now();

        const note = {
          type: OBJECT_TYPES.NOTE,
          attributedTo: outbox.owner,
          content: document.body.innerHTML,
          inReplyTo: record?.[context],
          published: new Date().toISOString()
        };

        try {
          addItem({ id: tempId, ...note });
          // TODO reset the form
          setExpanded(false);
          await outbox.post({ ...note, to: [...mentionedUsersUris, PUBLIC_URI] });
          notify('Commentaire posté avec succès', { type: 'success' });
        } catch (e) {
          console.error(e);
          removeItem(tempId);
          notify(e.message, { type: 'error' });
        }
      }
    },
    [outbox, notify, setExpanded, addItem, removeItem]
  );

  const openAuthIfDisconnected = useCallback(() => {
    if (!identity?.id) {
      setOpenAuth(true);
    }
  }, [identity, setOpenAuth]);

  // Don't init the editor options until mentions and identity are loaded, as they can only be initialized once
  if ((mentions && !mentions.items) || isLoading) return null;

  return (
    <>
      <Form onSubmit={onSubmit} className={classes.form}>
        <Box className={classes.container} onClick={openAuthIfDisconnected}>
          <Avatar
            src={
              // @ts-expect-error TS(2339): Property 'image' does not exist on type '{ title: ... Remove this comment to see the full error message
              identity?.webIdData?.[userDataModel?.fieldsMapping?.image] ||
              // @ts-expect-error TS(2339): Property 'image' does not exist on type '{ title: ... Remove this comment to see the full error message
              identity?.profileData?.[userDataModel?.fieldsMapping?.image]
            }
            className={classes.avatar}
          />
          <RichTextInput
            source="comment"
            label=" "
            toolbar={<EmptyToolbar />}
            fullWidth
            classes={{ editorContent: classes.editorContent }}
            editorOptions={{
              ...DefaultEditorOptions,
              onFocus() {
                setExpanded(true);
              },
              extensions: [
                // @ts-expect-error TS(2461): Type 'Extensions | undefined' is not an array type... Remove this comment to see the full error message
                ...DefaultEditorOptions.extensions,
                placeholder ? Placeholder.configure({ placeholder }) : null,
                mentions
                  ? CustomMention.configure({
                      HTMLAttributes: {
                        class: 'mention'
                      },
                      suggestion: mentions
                    })
                  : null
              ],
              // Disable editor if user is not connected
              editable: !!identity?.id
            }}
            helperText={helperText}
          />
          {expanded && (
            <Button
              type="submit"
              size="small"
              variant="contained"
              color="primary"
              endIcon={<SendIcon />}
              className={classes.button}
            >
              Envoyer
            </Button>
          )}
        </Box>
      </Form>
      <AuthDialog
        open={openAuth}
        onClose={() => setOpenAuth(false)}
        message="Pour poster un commentaire, vous devez être connecté."
      />
    </>
  );
};

export default PostCommentForm;
