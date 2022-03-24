import React from 'react';
import { useListContext, Link, linkToRecord } from 'react-admin';
import { makeStyles, Card, CardActionArea, CardMedia, CardContent, CardActions } from '@material-ui/core';
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
const MasonryList = ({ image, content, actions, breakpointCols, linkType }) => {
  const classes = useStyles();
  const { ids, data, basePath } = useListContext();
  return (
    <Masonry breakpointCols={breakpointCols} className={classes.grid} columnClassName={classes.column}>
      {ids.map(id => {
        if (!data[id]) return null;
        const imageUrl = typeof image === 'function' ? image(data[id]) : image;
        return (
          <Card key={id} className={classes.card}>
            <Link to={linkToRecord(basePath, id) + '/' + linkType}>
              <CardActionArea>
                {imageUrl && <CardMedia className={classes.media} image={imageUrl} />}
                {content && <CardContent>{content(data[id])}</CardContent>}
              </CardActionArea>
            </Link>
            {actions && (
              <CardActions>
                {actions.map(action => React.createElement(action, { record: data[id], basePath }))}
              </CardActions>
            )}
          </Card>
        );
      })}
    </Masonry>
  );
};

MasonryList.defaultProps = {
  breakpointCols: { default: 3, 1050: 2, 700: 1 },
  linkType: 'edit'
};

export default MasonryList;
