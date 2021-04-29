import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import MuiTab from '@material-ui/core/Tab';
import { useListController, ListContextProvider, getResources } from 'react-admin';
import classnames from 'classnames';

/**
 * To be used with InverseReferenceShowLayout
 */
const ListTab = ({
  basePath,
  children,
  context,
  className,
  icon,
  label,
  record,
  resource,
  syncWithLocation = true,
  value,
  inversePredicate,
  filter = {},
  showResourcesIcons = false,
  ...rest
}) => {
  const location = useLocation();
  const propsForLink = {
    component: Link,
    to: { ...location, pathname: value }
  };

  const resources = useSelector(getResources);
  const resourceDef = useMemo(() => resources.find(r => r?.name === resource), [resources, resource]);

  const listController = useListController({
    resource,
    basePath,
    filter: { [inversePredicate]: record?.id, ...filter },
    perPage: 500
  });

  const renderHeader = () => (
    <MuiTab
      key={label}
      label={
        listController.ids
          ? `${label || resourceDef.options?.label} (${listController.ids.length})`
          : label || resourceDef.options?.label
      }
      value={value}
      icon={icon || (showResourcesIcons && React.createElement(resourceDef.icon))}
      className={classnames('show-tab', className)}
      {...(syncWithLocation ? propsForLink : {})} // to avoid TypeScript screams, see https://github.com/mui-org/material-ui/issues/9106#issuecomment-451270521
      {...rest}
    />
  );

  const renderContent = () => <ListContextProvider value={listController}>{children}</ListContextProvider>;

  return context === 'header' ? renderHeader() : renderContent();
};

export default ListTab;
