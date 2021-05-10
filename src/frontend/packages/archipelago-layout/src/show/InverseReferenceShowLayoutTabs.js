import * as React from 'react';
import { Children, cloneElement, isValidElement } from 'react';
import { getTabFullPath } from 'react-admin';
import PropTypes from 'prop-types';
import Tabs from '@material-ui/core/Tabs';
import { useLocation, useRouteMatch } from 'react-router-dom';

/**
 * This is a clone of React-Admin TabbedShowLayoutTabs, except we pass record and showResourcesIcons to the tabs
 */
const InverseReferenceShowLayoutTabs = ({ children, syncWithLocation, value, record, showResourcesIcons, ...rest }) => {
  const location = useLocation();
  const match = useRouteMatch();

  // The location pathname will contain the page path including the current tab path
  // so we can use it as a way to determine the current tab
  const tabValue = location.pathname;

  return (
    <Tabs indicatorColor="primary" value={syncWithLocation ? tabValue : value} {...rest}>
      {Children.map(children, (tab, index) => {
        if (!tab || !isValidElement(tab)) return null;
        // Builds the full tab which is the concatenation of the last matched route in the
        // TabbedShowLayout hierarchy (ex: '/posts/create', '/posts/12', , '/posts/12/show')
        // and the tab path.
        // This will be used as the Tab's value
        const tabPath = getTabFullPath(tab, index, match.url);

        return cloneElement(tab, {
          context: 'header',
          value: syncWithLocation ? tabPath : index,
          syncWithLocation,
          record,
          showResourcesIcons
        });
      })}
    </Tabs>
  );
};

InverseReferenceShowLayoutTabs.propTypes = {
  children: PropTypes.node
};

export default InverseReferenceShowLayoutTabs;
