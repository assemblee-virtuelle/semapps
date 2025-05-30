import React from 'react';
import { useListContext, Link, useCreatePath, RecordContextProvider } from 'react-admin';
import { Card, CardActionArea, CardMedia, CardContent, CardActions, makeStyles } from '@mui/material';
import Masonry from 'react-masonry-css';

const useStyles = makeStyles(() => ({
  grid: {
    display: 'flex',
    marginLeft: -20,
    marginBottom: -20,
    width: 'auto'
  },
  column: {
    paddingLeft: 20,
    backgroundClip: 'padding-box'
  },
  card: {
    marginBottom: 20
  },
  media: {
    height: 0,
    paddingTop: '56.25%' // 16:9
  }
}));

/**
 * @example
 * <List component="div" perPage={50} {...props}>
 *   <MasonryList
 *     image={record => record.image}
 *     content={record => (
 *       <>
 *         <Typography variant="subtitle1">{record.title}</Typography>
 *         <Typography variant="body2" color="textSecondary" component="p">{record.description}</Typography>
 *       </>
 *     )}
 *     linkType="show"
 *   />
 * </List>
 */
const MasonryList = ({
  image,
  content,
  actions,
  breakpointCols = { default: 3, 1050: 2, 700: 1 },
  linkType = 'edit'
}) => {
  const classes = useStyles();
  const { data, resource } = useListContext();
  const createPath = useCreatePath();
  return (
    <Masonry breakpointCols={breakpointCols} className={classes.grid} columnClassName={classes.column}>
      {data.map(record => {
        if (!record || record._error) return null;
        const imageUrl = typeof image === 'function' ? image(record) : image;
        return (
          <RecordContextProvider value={record}>
            <Card key={record.id} className={classes.card}>
              <Link to={createPath({ resource, id: record.id, type: linkType })}>
                <CardActionArea>
                  {imageUrl && <CardMedia className={classes.media} image={imageUrl} />}
                  {content && <CardContent>{content(record)}</CardContent>}
                </CardActionArea>
              </Link>
              {actions && <CardActions>{actions.map(action => React.createElement(action))}</CardActions>}
            </Card>
          </RecordContextProvider>
        );
      })}
    </Masonry>
  );
};

export default MasonryList;
