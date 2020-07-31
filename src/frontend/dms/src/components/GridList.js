import * as React from 'react';
import { useListContext, linkToRecord } from 'react-admin';
import { Grid } from '@material-ui/core';
import { Link } from 'react-router-dom';

// useful to prevent click bubbling in a datagrid with rowClick
const stopPropagation = e => e.stopPropagation();

// Our handleClick does nothing as we wrap the children inside a Link but it is
// required by ChipField, which uses a Chip from material-ui.
// The material-ui Chip requires an onClick handler to behave like a clickable element.
const handleClick = () => {};

const GridList = ({ children, xs, linkType }) => {
  const { ids, data, basePath } = useListContext();
  return (
    <Grid container spacing={3}>
      {ids.map(id => {
        const resourceLinkPath = linkToRecord(basePath, id, linkType);
        return (
          <Grid item xs={xs}>
            <Link
              key={id}
              to={resourceLinkPath}
              onClick={stopPropagation}
            >
              {React.cloneElement(React.Children.only(children), {
                record: data[id],
                basePath,
                // Workaround to force ChipField to be clickable
                onClick: handleClick,
              })}
            </Link>
          </Grid>
        );
      })}
    </Grid>
  );
};

GridList.defaultProps = {
  xs: 6,
  linkType: 'edit'
};

export default GridList;
