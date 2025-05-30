import React from 'react';
import {
  ChipField,
  useCreatePath,
  useListContext,
  sanitizeListRestProps,
  RecordContextProvider,
  Link
} from 'react-admin';
import { LinearProgress, makeStyles } from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import LaunchIcon from '@mui/icons-material/Launch';
import { useGetExternalLink } from '@semapps/semantic-data-provider';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  link: {
    textDecoration: 'none',
    maxWidth: '100%'
  },
  chipField: {
    maxWidth: '100%'
  },
  addIcon: {
    cursor: 'pointer',
    fontSize: 35,
    position: 'relative',
    top: 2
  },
  launchIcon: {
    width: 20,
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
  const { data, isLoading, resource } = useListContext(props);
  const getExternalLink = useGetExternalLink(externalLinks);
  const createPath = useCreatePath();

  const classes = useStyles(props);
  const Component = component;

  if (isLoading) return <LinearProgress />;

  return (
    <Component className={classes.root} {...sanitizeListRestProps(rest)}>
      {data.map(record => {
        if (!record || record._error) return null;
        const externalLink = getExternalLink(record);
        if (externalLink) {
          return (
            <RecordContextProvider value={record} key={record.id}>
              <a
                href={externalLink}
                target="_blank"
                rel="noopener noreferrer"
                className={classes.link}
                onClick={stopPropagation}
              >
                <ChipField
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
          );
        }
        if (linkType) {
          return (
            <RecordContextProvider value={record} key={record.id}>
              <Link
                className={classes.link}
                to={createPath({ resource, id: record.id, type: linkType })}
                onClick={stopPropagation}
              >
                <ChipField
                  source={primaryText}
                  className={classes.chipField}
                  color="secondary"
                  // Workaround to force ChipField to be clickable
                  onClick={handleClick}
                />
              </Link>
            </RecordContextProvider>
          );
        }
        return (
          <RecordContextProvider value={record} key={record.id}>
            <ChipField
              source={primaryText}
              className={classes.chipField}
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
