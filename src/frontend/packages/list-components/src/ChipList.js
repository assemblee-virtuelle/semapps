import React from 'react';
import {
  ChipField,
  useResourceContext,
  useListContext,
  sanitizeListRestProps,
  linkToRecord,
  RecordContextProvider,
  Link
} from 'react-admin';
import { makeStyles, LinearProgress } from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  link: {},
  addIcon: {
    cursor: 'pointer',
    fontSize: 35,
    position: 'relative',
    top: -2,
    left: -2
  }
}));

const stopPropagation = e => e.stopPropagation();

// Our handleClick does nothing as we wrap the children inside a Link but it is
// required by ChipField, which uses a Chip from material-ui.
// The material-ui Chip requires an onClick handler to behave like a clickable element.
const handleClick = () => {};

const ChipList = props => {
  const {
    classes: classesOverride,
    className,
    children,
    linkType = 'edit',
    component = 'div',
    primaryText,
    appendLink,
    ...rest
  } = props;
  const { ids, data, loaded, basePath } = useListContext(props);
  const resource = useResourceContext(props);

  const classes = useStyles(props);
  const Component = component;

  if (loaded === false) {
    return <LinearProgress />;
  }

  return (
    <Component className={classes.root} {...sanitizeListRestProps(rest)}>
      {ids.map(id => {
        if (!data[id]) return null;
        const resourceLinkPath = !linkType ? false : linkToRecord(basePath, id, linkType);

        if (resourceLinkPath) {
          return (
            <RecordContextProvider value={data[id]} key={id}>
              <Link className={classes.link} key={id} to={resourceLinkPath} onClick={stopPropagation}>
                <ChipField
                  record={data[id]}
                  resource={resource}
                  basePath={basePath}
                  source={primaryText}
                  color="secondary"
                  // Workaround to force ChipField to be clickable
                  onClick={handleClick}
                />
              </Link>
            </RecordContextProvider>
          );
        }

        return (
          <RecordContextProvider value={data[id]} key={id}>
            <ChipField
              record={data[id]}
              resource={resource}
              basePath={basePath}
              source={primaryText}
              color="secondary"
              // Workaround to force ChipField to be clickable
              onClick={handleClick}
            />
          </RecordContextProvider>
        );
      })}
      {appendLink && <AddCircleIcon color="primary" className={classes.addIcon} onClick={appendLink} />}
    </Component>
  );
};

export default ChipList;
