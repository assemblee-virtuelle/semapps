import React, { useState, useCallback } from 'react';
import { useGetIdentity, useNotify, useRecordContext } from 'react-admin';
import { RichTextInput, DefaultEditorOptions } from 'ra-richtext-tiptap';
import { Form } from 'react-final-form';
import { Button, Box, makeStyles, Avatar } from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import { useDataModel } from "@semapps/semantic-data-provider";
import { OBJECT_TYPES, PUBLIC_URI } from '../../constants';
import useOutbox from '../../hooks/useOutbox';
import CustomMention from "./CustomMention";

const useStyles = makeStyles(theme => ({
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
    height: 64,
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
    marginBottom: -19
  },
  button: {
    marginBottom: 15
  }
}));

const PostCommentForm = ({ context, helperText, mentions, userResource, addItem, removeItem }) => {
  const record = useRecordContext();
  const { identity } = useGetIdentity();
  const userDataModel = useDataModel(userResource);
  const classes = useStyles();
  const notify = useNotify();
  const outbox = useOutbox();
  const [expanded, setExpanded] = useState(false);

  const onSubmit = useCallback(async (values, { reset }) => {
    const document = new DOMParser().parseFromString(values.comment, 'text/html');
    const mentions = Array.from(document.body.getElementsByClassName('mention'));
    let mentionedUsersUris = [];

    mentions.forEach(node => {
      const userUri = node.attributes['data-mention-id'].value;
      const userLabel = node.attributes['data-mention-label'].value;
      const link = document.createElement('a');
      link.setAttribute('href', new URL(window.location.href).origin + '/' + userResource + '/' + encodeURIComponent(userUri) + '/show');
      link.textContent = '@' + userLabel;
      node.parentNode.replaceChild(link, node);
      mentionedUsersUris.push(userUri);
    });

    if (document.body.innerHTML === 'undefined') {
      notify('Votre commentaire est vide', 'error');
    } else {
      const tempId = Date.now();

      const note = {
        type: OBJECT_TYPES.NOTE,
        attributedTo: outbox.owner,
        content: document.body.innerHTML,
        inReplyTo: record[context],
        published: (new Date()).toISOString()
      };

      try {
        addItem({ id: tempId, ...note });
        reset();
        setExpanded(false);
        await outbox.post({ ...note, to: [...mentionedUsersUris, PUBLIC_URI] });
        notify('Commentaire posté avec succès', 'success');
      } catch (e) {
        removeItem(tempId);
        notify(e.message, 'error');
      }
    }
  }, [outbox, notify, setExpanded, addItem, removeItem]);

  // Don't init the comment field until the mentions are loaded, as the suggestion field can only be initialized once
  if( mentions && !mentions.items ) return null;

  return (
    <Form
      onSubmit={onSubmit}
      subscription={{ submitting: true, pristine: true }}
      render={({ handleSubmit, submitting, pristine }) => {
        // Hack to clear comment input when form is reset
        // TODO When we update to React-Admin 4, check if the new RichTextInput solves this bug
        if (pristine) {
          const commentElement = document.getElementById("comment");
          if (commentElement) commentElement.innerHTML = '';
        }

        return (
          <form onSubmit={handleSubmit} className={classes.form}>
            <Box className={classes.container}>
              <Avatar
                src={identity?.webIdData?.[userDataModel?.fieldsMapping?.image]}
                className={classes.avatar}
              />
              <RichTextInput
                source="comment"
                label=""
                toolbar={null}
                fullWidth
                classes={{ editorContent: classes.editorContent }}
                editorOptions={{
                  ...DefaultEditorOptions,
                  onFocus() { setExpanded(true) },
                  extensions: [
                    ...DefaultEditorOptions.extensions,
                    mentions ? CustomMention.configure({
                      HTMLAttributes: {
                        class: 'mention',
                      },
                      suggestion: mentions,
                    }) : null
                  ],
                }}
                helperText={helperText}
              />
              {expanded &&
                <Button type="submit" size="small" variant="contained" color="primary" endIcon={<SendIcon />} disabled={submitting} className={classes.button}>
                  Envoyer
                </Button>
              }
            </Box>
          </form>
        )
      }}
    />
  );
};

export default PostCommentForm;
