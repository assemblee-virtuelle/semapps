import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import { useMediaQuery, Box } from '@material-ui/core';
import { getResources } from 'react-admin';
import DefaultIcon from '@material-ui/icons/ViewList';
import SubMenu from './SubMenu';
import ResourceMenuLink from './ResourceMenuLink';

const TreeMenu = ({ onMenuClick, logout, dense = false, openAll = false }) => {
  const isXSmall = useMediaQuery(theme => theme.breakpoints.down('xs'));
  // const open = useSelector(state => state.admin.ui.sidebarOpen);
  const resources = useSelector(getResources);

  // TODO create a specialized hook, as this is used several times in the layout (which cannot use useResourceDefinition)
  const location = useLocation();
  const matches = location.pathname.match(/^\/([^/]+)/);
  const currentResourceName = matches ? matches[1] : null;

  const [openSubMenus, setOpenSubMenus] = useState({});
  const handleToggle = menu => {
    setOpenSubMenus(state => ({ ...state, [menu]: !state[menu] }));
  };

  // Calculate available categories
  const categories = useMemo(() => {
    const names = resources.reduce((categories, resource) => {
      if (resource.options && resource.options.parent) categories.push(resource.options.parent);
      return categories;
    }, []);
    return resources.filter(resource => names.includes(resource.name));
  }, [resources]);

  // Open all submenus by default
  useEffect(() => {
    const currentResource = resources.find(resource => resource.name === currentResourceName);
    const currentCategory =
      currentResource && categories.find(category => category.name === currentResource.options.parent);
    const defaultValues = categories.reduce((acc, category) => {
      acc[category.name] = openAll || (currentCategory && category.name === currentCategory.name);
      return acc;
    }, {});
    setOpenSubMenus(state => ({ ...defaultValues, ...state }));
  }, [categories, resources, currentResourceName, openAll]);

  return (
    <Box mt={2}>
      {categories.map(category => (
        <SubMenu
          key={category.name}
          handleToggle={() => handleToggle(category.name)}
          isOpen={openSubMenus[category.name]}
          sidebarIsOpen
          name={(category.options && category.options.label) || category.name}
          icon={category.icon ? <category.icon /> : <DefaultIcon />}
          dense={dense}
        >
          {resources
            .filter(resource => resource.hasList && resource.options.parent === category.name)
            .map(resource => (
              <ResourceMenuLink key={resource.name} resource={resource} onClick={onMenuClick} open={true} />
            ))}
        </SubMenu>
      ))}
      {resources
        .filter(resource => resource.hasList && (!resource.options || !resource.options.parent))
        .map(resource => (
          <ResourceMenuLink key={resource.name} resource={resource} onClick={onMenuClick} open={true} />
        ))}
      {isXSmall && logout}
    </Box>
  );
};

export default TreeMenu;
