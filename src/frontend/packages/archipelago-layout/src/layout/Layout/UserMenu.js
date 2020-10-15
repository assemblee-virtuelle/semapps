import * as React from 'react';
import { Children, cloneElement, isValidElement, useState } from 'react';
import { useAuthState, useGetIdentity, MenuItemLink, useTranslate } from 'react-admin';
import PropTypes from 'prop-types';
import { Box, Button, Menu, MenuItem } from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import AccountCircle from '@material-ui/icons/AccountCircle';

const UserMenu = ({ children, label, icon, logout }) => {
  // const { loading, authenticated } = useAuthState();
  const { identity } = useGetIdentity();
  const [anchorEl, setAnchorEl] = useState(null);
  const translate = useTranslate();

  if (!logout && !children) return null;
  const open = Boolean(anchorEl);

  const handleMenu = event => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <Box spacing={2}>
      <Button variant="outlined" onClick={handleMenu} endIcon={<ArrowDropDownIcon />}>
        {identity ? identity.name : 'Anonyme'}
      </Button>
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        open={open}
        onClose={handleClose}
      >
        {identity ?
          logout
        : <MenuItemLink to="/login" onClick={handleClose}>Se connecter</MenuItemLink>
        }
      </Menu>
    </Box>
  );
};

UserMenu.propTypes = {
  children: PropTypes.node,
  label: PropTypes.string.isRequired,
  logout: PropTypes.element,
  icon: PropTypes.node
};

UserMenu.defaultProps = {
  label: 'ra.auth.user_menu',
  icon: <AccountCircle />
};

export default UserMenu;
