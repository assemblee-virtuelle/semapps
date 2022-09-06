import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import { useMediaQuery, Box, makeStyles } from '@material-ui/core';
import { getResources } from 'react-admin';
import DefaultIcon from '@material-ui/icons/ViewList';
import SubMenu from './SubMenu';
import ResourceMenuLink from './ResourceMenuLink';

const useStyles = makeStyles(theme => ({
  treeMenuOneRowLabel: {
    '& .MuiMenuItem-root': {
      display: 'block',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      maxWidth: 240,
      '& > .MuiListItemIcon-root': {
        verticalAlign: 'middle'
      }
    }
  },
  treeMenu: props => ({
    '& .MuiMenuItem-root': {
      whiteSpace: 'normal',
      maxWidth: 240,
      maxHeight: 10 + 24 * props.labelNbLines,
      paddingLeft: 56,
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      display: '-webkit-box',
      '-webkit-line-clamp': props.labelNbLines,
      '-webkit-box-orient': 'vertical',
      '& > .MuiListItemIcon-root': {
        position: 'absolute',
        left: 16
      }
    },
    '& .MuiCollapse-root': {
      '& .MuiMenuItem-root': {
        paddingLeft: 72,
        '& > .MuiListItemIcon-root': {
          left: 32
        }
      }
    }
  })
}));

const TreeMenu = ({ onMenuClick, logout, dense = false, openAll = false, labelNbLines = 1 }) => {
  const isXSmall = useMediaQuery(theme => theme.breakpoints.down('xs'));
  const isSmall = useMediaQuery(theme => theme.breakpoints.only('sm'));
  labelNbLines = isSmall ? 1 : labelNbLines;
  const classes = useStyles({ labelNbLines });
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
  const menuRootItems = useMemo(() => resources.filter(r => !r.options.parent), [resources]);

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
    <Box mt={2} className={labelNbLines === 1 ? classes.treeMenuOneRowLabel : classes.treeMenu}>
      {menuRootItems.map(menuRootItem => (
        <Box key={menuRootItem.name}>
          {categories.includes(menuRootItem) ? (
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
                ))}
            </SubMenu>
          ) : (
            <>
              {menuRootItem.hasList && (
                <ResourceMenuLink key={menuRootItem.name} resource={menuRootItem} onClick={onMenuClick} open={true} />
              )}
            </>
          )}
        </Box>
      ))}
      {isXSmall && logout}
    </Box>
  );
};

export default TreeMenu;
