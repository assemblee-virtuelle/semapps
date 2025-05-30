import React from 'react';
import { useRecordContext } from 'react-admin';
import PostCommentForm from './PostCommentForm';
import CommentsList from './CommentsList';
import useCollection from '../../hooks/useCollection';

const CommentsField = ({
  source = 'id',
  context = 'id',
  helperText,
  placeholder = 'Commencez à taper votre commentaire...',
  userResource,
  mentions
}) => {
  const record = useRecordContext();
  const { items: comments, loading, addItem, removeItem } = useCollection(record.replies, { liveUpdates: true });
  if (!userResource) throw new Error('No userResource defined for CommentsField');
  return (
    <>
      <PostCommentForm
        context={context}
        helperText={helperText}
        userResource={userResource}
        placeholder={placeholder}
        mentions={mentions}
        addItem={addItem}
        removeItem={removeItem}
      />
      <CommentsList comments={comments} loading={loading} userResource={userResource} />
    </>
  );
};

export default CommentsField;
