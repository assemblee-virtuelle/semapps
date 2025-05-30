import React from 'react';
import { TextField, RichTextField, DateField } from 'react-admin';
import { Box, Typography, CircularProgress, makeStyles } from '@mui/material';
import { useDataModel } from '@semapps/semantic-data-provider';
import { AvatarWithLabelField, ReferenceField } from '@semapps/field-components';

const useStyles = makeStyles(() => ({
  container: {
    paddingLeft: 80,
    marginTop: 8,
    minHeight: 80,
    position: 'relative'
  },
  avatar: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: 64,
    height: 64
  },
  text: {
    paddingTop: 2,
    paddingBottom: 8
  },
  label: {
    fontWeight: 'bold'
  },
  content: {
    '& p': {
      marginBlockStart: '0.5em',
      marginBlockEnd: '0.5em'
    }
  },
  loading: {
    zIndex: 1000,
    backgroundColor: 'white',
    opacity: 0.5,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
    marginTop: 5
  }
}));

const CommentsList = ({ comments, userResource, loading }) => {
  const classes = useStyles();
  const userDataModel = useDataModel(userResource);
  return (
    <Box position="relative">
      {comments &&
        comments
          .sort((a, b) => new Date(b.published) - new Date(a.published))
          .map(comment => (
            <Box className={classes.container} key={comment.id}>
              <Box className={classes.avatar}>
                <ReferenceField record={comment} reference={userResource} source="attributedTo" linkType="show">
                  <AvatarWithLabelField image={userDataModel?.fieldsMapping?.image} />
                </ReferenceField>
              </Box>
              <Box className={classes.text}>
                <Typography variant="body2">
                  <ReferenceField record={comment} reference={userResource} source="attributedTo" linkType="show">
                    <TextField variant="body2" source={userDataModel?.fieldsMapping?.title} className={classes.label} />
                  </ReferenceField>
                  &nbsp;•&nbsp;
                  <DateField record={comment} variant="body2" source="published" showTime />
                </Typography>
                <RichTextField record={comment} variant="body1" source="content" className={classes.content} />
              </Box>
            </Box>
          ))}
      {loading && (
        <Box minHeight={200}>
          <Box alignItems="center" className={classes.loading}>
            <CircularProgress size={60} thickness={6} />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default CommentsList;
