import * as React from 'react';
import { cloneElement, Children } from 'react';
import { linkToRecord, sanitizeListRestProps, useListContext, Link } from 'react-admin';
import classnames from 'classnames';
import { LinearProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  link: {}
}));

// useful to prevent click bubbling in a datagrid with rowClick
const stopPropagation = e => e.stopPropagation();

// Our handleClick does nothing as we wrap the children inside a Link but it is
// required by ChipField, which uses a Chip from material-ui.
// The material-ui Chip requires an onClick handler to behave like a clickable element.
const handleClick = () => {};

const SeparatedListField = props => {
  const { classes: classesOverride, className, children, linkType = 'edit', separator = ',', ...rest } = props;
  const { ids, data, loaded, resource, basePath } = useListContext(props);

  const classes = useStyles(props);

  if (loaded === false) {
    return <LinearProgress />;
  }

  return (
    <div className={classnames(classes.root, className)} {...sanitizeListRestProps(rest)}>
      {ids.map((id, i) => {
        const resourceLinkPath = !linkType ? false : linkToRecord(basePath, id, linkType);

        if (resourceLinkPath) {
          return (
            <span key={id}>
              <Link classes={classes.link} to={resourceLinkPath} onClick={stopPropagation}>
                {cloneElement(Children.only(children), {
                  record: data[id],
                  resource,
                  basePath,
                  // Workaround to force ChipField to be clickable
                  onClick: handleClick
                })}
              </Link>
              {i < ids.length - 1 && separator + '\u00A0'}
            </span>
          );
        }

        return cloneElement(Children.only(children), {
          key: id,
          record: data[id],
          resource,
          basePath
        });
      })}
    </div>
  );
};

export default SeparatedListField;
