import React, { Children, cloneElement, isValidElement, useState } from 'react';
import { Route } from 'react-router-dom';
import { makeStyles, Divider } from '@material-ui/core';
import { useRouteMatch } from 'react-router-dom';
import { escapePath, getTabFullPath } from 'react-admin';
import InverseReferenceShowLayoutTabs from './InverseReferenceShowLayoutTabs';

const useStyles = makeStyles(theme => ({
  content: {
    padding: theme.spacing(2)
  }
}));

/**
 * @example
 * const ThemeShow = props => (
 *  <Show {...props}>
 *    <InverseReferenceShowLayout>
 *      <ListTab resource="Project" basePath="/Project" inversePredicate="pair:hasTopic">
 *        <SimpleList ... />
 *      </ListTab>
 *      <ListTab resource="Person" basePath="/Person" inversePredicate="pair:hasTopic">
 *       <SimpleList ... />
 *      </ListTab>
 *    </InverseReferenceShowLayout>
 *  </Show>
 * );
 */
export const InverseReferenceShowLayout = ({
  children,
  syncWithLocation = true,
  tabs,
  record,
  showResourcesIcons = false
}) => {
  const match = useRouteMatch();
  const classes = useStyles();
  const nonNullChildren = Children.toArray(children).filter(child => child !== null);

  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, value) => {
    if (!syncWithLocation) {
      setTabValue(value);
    }
  };

  return (
    <div>
      {cloneElement(
        tabs,
        {
          syncWithLocation,
          onChange: handleTabChange,
          value: tabValue,
          record,
          showResourcesIcons
        },
        nonNullChildren
      )}
      <Divider />
      <div className={classes.content}>
        {Children.map(nonNullChildren, (tab, index) =>
          tab && isValidElement(tab) ? (
            syncWithLocation ? (
              <Route
                exact
                path={escapePath(getTabFullPath(tab, index, match.url))}
                render={() =>
                  cloneElement(tab, {
                    context: 'content',
                    record
                  })
                }
              />
            ) : tabValue === index ? (
              cloneElement(tab, {
                context: 'content',
                record
              })
            ) : null
          ) : null
        )}
      </div>
    </div>
  );
};

InverseReferenceShowLayout.defaultProps = {
  tabs: <InverseReferenceShowLayoutTabs />
};

export default InverseReferenceShowLayout;
