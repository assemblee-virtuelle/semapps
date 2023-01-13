import * as React from 'react';
import { cloneElement, Children } from 'react';
import { linkToRecord, useListContext, useResourceContext, Link } from 'react-admin';
import { LinearProgress } from '@mui/material';

// useful to prevent click bubbling in a datagrid with rowClick
const stopPropagation = e => e.stopPropagation();

// Our handleClick does nothing as we wrap the children inside a Link but it is
// required by ChipField, which uses a Chip from material-ui.
// The material-ui Chip requires an onClick handler to behave like a clickable element.
const handleClick = () => {};

const SeparatedListField = props => {
  let { classes: classesOverride, className, children, link = 'edit', linkType, separator = ',\u00A0' } = props;
  const { data, isLoading, resource } = useListContext(props);
  const basePath = '/' + useResourceContext(resource);
  
  if (linkType !== undefined) {
    console.warn("The 'linkType' prop is deprecated and should be named to 'link' in <SeparatedListField />");
    link = linkType;
  }

  if (isLoading === true) {
    return <LinearProgress />;
  }
  
  return (
    <React.Fragment>
      {data.map((dataItem, i) => {
        if (!dataItem.id) return null;
        const resourceLinkPath =
          link !== false && (typeof link === 'function' ? link(dataItem.id) : linkToRecord(basePath, dataItem.id, link));
        if (resourceLinkPath) {
          return (
            <span key={dataItem.id}>
              <Link to={resourceLinkPath} onClick={stopPropagation}>
                {cloneElement(Children.only(children), {
                  //record: dataItem.id,
                  resource,
                  basePath,
                  // Workaround to force ChipField to be clickable
                  onClick: handleClick
                })}
              </Link>
              {i < data.length - 1 && separator}
            </span>
          );
        }

        return (
          <span key={dataItem.id}>
            {cloneElement(Children.only(children), {
              //record: dataItem.id,
              resource,
              basePath
            })}
            {i < data.length - 1 && separator}
          </span>
        );
      })}
    </React.Fragment>
  );
};

export default SeparatedListField;
