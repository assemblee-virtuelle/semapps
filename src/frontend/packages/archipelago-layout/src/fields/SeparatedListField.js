import * as React from 'react';
import { cloneElement, Children } from 'react';
import { linkToRecord, useListContext, Link } from 'react-admin';
import { LinearProgress } from '@material-ui/core';

// useful to prevent click bubbling in a datagrid with rowClick
const stopPropagation = e => e.stopPropagation();

// Our handleClick does nothing as we wrap the children inside a Link but it is
// required by ChipField, which uses a Chip from material-ui.
// The material-ui Chip requires an onClick handler to behave like a clickable element.
const handleClick = () => {};

const SeparatedListField = props => {
  let { classes: classesOverride, className, children, link = 'edit', linkType, separator = ',\u00A0' } = props;
  const { ids, data, loaded, resource, basePath } = useListContext(props);

  if (linkType !== undefined) {
    console.warn("The 'linkType' prop is deprecated and should be named to 'link' in <SeparatedListField />");
    link = linkType;
  }

  if (loaded === false) {
    return <LinearProgress />;
  }

  return (
    <React.Fragment>
      {ids.map((id, i) => {
        if( !data[id] ) return null;
        const resourceLinkPath = typeof link === 'function' ? link(data[id]) : linkToRecord(basePath, id, link);

        if (resourceLinkPath) {
          return (
            <span key={id}>
              <Link to={resourceLinkPath} onClick={stopPropagation}>
                {cloneElement(Children.only(children), {
                  record: data[id],
                  resource,
                  basePath,
                  // Workaround to force ChipField to be clickable
                  onClick: handleClick
                })}
              </Link>
              {i < ids.length - 1 && separator}
            </span>
          );
        }

        return (
          <span key={id}>
            {cloneElement(Children.only(children), {
              record: data[id],
              resource,
              basePath
            })}
            {i < ids.length - 1 && separator}
          </span>
        );
      })}
    </React.Fragment>
  );
};

export default SeparatedListField;
