import * as React from 'react';
import { cloneElement, Children } from 'react';
import { useCreatePath, useListContext, Link, RecordContextProvider } from 'react-admin';
import { LinearProgress } from '@mui/material';

// useful to prevent click bubbling in a datagrid with rowClick
const stopPropagation = (e: any) => e.stopPropagation();

// Our handleClick does nothing as we wrap the children inside a Link but it is
// required by ChipField, which uses a Chip from material-ui.
// The material-ui Chip requires an onClick handler to behave like a clickable element.
const handleClick = () => {};

const SeparatedListField = (props: any) => {
  let { children, link = 'edit', linkType, separator = ',\u00A0' } = props;
  // @ts-expect-error TS(2554): Expected 0 arguments, but got 1.
  const { data, isLoading, resource } = useListContext(props);
  const createPath = useCreatePath();

  if (linkType !== undefined) {
    console.warn("The 'linkType' prop is deprecated and should be named to 'link' in <SeparatedListField />");
    link = linkType;
  }

  if (isLoading) return <LinearProgress />;

  return (
    <>
      {
        // @ts-expect-error TS(2532): Object is possibly 'undefined'.
        data.map((record, i) => {
          if (!record.id) return null;
          const resourceLinkPath =
            link !== false &&
            (typeof link === 'function' ? link(record.id) : createPath({ resource, id: record.id, type: link }));
          if (resourceLinkPath) {
            return (
              <span key={record.id}>
                <Link to={resourceLinkPath} onClick={stopPropagation}>
                  {cloneElement(Children.only(children), {
                    // Workaround to force ChipField to be clickable
                    onClick: handleClick
                  })}
                </Link>
                {
                  // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                  i < data.length - 1 && separator
                }
              </span>
            );
          }

          return (
            <span key={record.id}>
              <RecordContextProvider value={record}>{children}</RecordContextProvider>
              {
                // @ts-expect-error TS(2532): Object is possibly 'undefined'.
                i < data.length - 1 && separator
              }
            </span>
          );
        })
      }
    </>
  );
};

export default SeparatedListField;
