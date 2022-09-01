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
  
  // Get menu root items
  const menuRootItems = useMemo(() => resources.filter(r => !r.options.parent),[resources])
  
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
      {menuRootItems.map(menuRootItem => (
        <Box key={menuRootItem.name}>
          { categories.includes(menuRootItem) ? (
            <SubMenu
              key={menuRootItem.name}
              handleToggle={() => handleToggle(menuRootItem.name)}
              isOpen={openSubMenus[menuRootItem.name]}
              sidebarIsOpen
              name={(menuRootItem.options && menuRootItem.options.label) || menuRootItem.name}
              icon={menuRootItem.icon ? <menuRootItem.icon /> : <DefaultIcon />}
              dense={dense}
            >
              {resources
                .filter(resource => resource.hasList && resource.options.parent === menuRootItem.name)
                .map(resource => (
                  <ResourceMenuLink key={resource.name} resource={resource} onClick={onMenuClick} open={true} />
                ))
              }
            </SubMenu>
          ) : (
            <>
              { menuRootItem.hasList &&
                <ResourceMenuLink key={menuRootItem.name} resource={menuRootItem} onClick={onMenuClick} open={true} />
              }
            </>
          )}
        </Box>
      ))}
      {isXSmall && logout}
    </Box>
  );
};

export default TreeMenu;
