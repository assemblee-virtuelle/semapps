import React from 'react';
import { useRecordContext } from 'react-admin';
import PostCommentForm from './PostCommentForm';
import CommentsList from './CommentsList';
import useCollection from '../../hooks/useCollection';

const CommentsField = ({ source, context, helperText, userResource, mentions }) => {
  const record = useRecordContext();
  const { items: comments, loading, addItem, removeItem } = useCollection(record.replies);
  if (!userResource) throw new Error('No userResource defined for CommentsField');
  return (
    <>
      <PostCommentForm
        context={context}
        helperText={helperText}
        userResource={userResource}
        mentions={mentions}
        addItem={addItem}
        removeItem={removeItem}
      />
      <CommentsList comments={comments} loading={loading} userResource={userResource} />
    </>
  );
};

CommentsField.defaultProps = {
  addLabel: true,
  label: 'Commentaires',
  source: 'id', // Ensure the field is always displayed
  context: 'id'
};

export default CommentsField;
