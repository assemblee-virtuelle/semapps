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
import LaunchIcon from '@material-ui/icons/Launch';
import { useGetExternalLink } from "@semapps/semantic-data-provider";

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  link: {
    textDecoration: 'none',
    maxWidth: "100%",
  },
  chipField: {
    maxWidth: "100%",
  },
  addIcon: {
    cursor: 'pointer',
    fontSize: 35,
    position: 'relative',
    top: -2,
    left: -2
  },
  launchIcon: {
    width: 16,
    paddingRight: 6,
    marginLeft: -10
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
    externalLinks = false,
    ...rest
  } = props;
  const { ids, data, loaded, basePath } = useListContext(props);
  const resource = useResourceContext(props);
  const getExternalLink = useGetExternalLink(externalLinks);

  const classes = useStyles(props);
  const Component = component;

  if (loaded === false) {
    return <LinearProgress />;
  }

  return (
    <Component className={classes.root} {...sanitizeListRestProps(rest)}>
      {ids.map(id => {
        if (!data[id]) return null;
        const externalLink = getExternalLink(data[id]);
        if (externalLink) {
          return(
            <RecordContextProvider value={data[id]} key={id}>
              <a href={externalLink} target="_blank" rel="noopener noreferrer" className={classes.link} onClick={stopPropagation}>
                <ChipField
                  record={data[id]}
                  resource={resource}
                  basePath={basePath}
                  source={primaryText}
                  className={classes.chipField}
                  color="secondary"
                  deleteIcon={<LaunchIcon className={classes.launchIcon} />}
                  // Workaround to force ChipField to be clickable
                  onClick={handleClick}
                  // Required to display the delete icon
                  onDelete={handleClick}
                />
              </a>
            </RecordContextProvider>
          )
        } else if (linkType) {
          return (
            <RecordContextProvider value={data[id]} key={id}>
              <Link className={classes.link} to={linkToRecord(basePath, id, linkType)} onClick={stopPropagation}>
                <ChipField
                  record={data[id]}
                  resource={resource}
                  basePath={basePath}
                  source={primaryText}
                  className={classes.chipField}
                  color="secondary"
                  // Workaround to force ChipField to be clickable
                  onClick={handleClick}
                />
              </Link>
            </RecordContextProvider>
          );
        } else {
          return (
            <RecordContextProvider value={data[id]} key={id}>
              <ChipField
                record={data[id]}
                resource={resource}
                basePath={basePath}
                source={primaryText}
                className={classes.chipField}
                color="secondary"
                // Workaround to force ChipField to be clickable
                onClick={handleClick}
              />
            </RecordContextProvider>
          );
        }
      })}
      {appendLink && <AddCircleIcon color="primary" className={classes.addIcon} onClick={appendLink} />}
    </Component>
  );
};

export default ChipList;
