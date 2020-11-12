import React, { useState } from 'react';
import { useGetIdentity, MenuItemLink } from 'react-admin';
import PropTypes from 'prop-types';
import { Box, Button, Menu, MenuItem } from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import AccountCircle from '@material-ui/icons/AccountCircle';

const UserMenu = ({ children, label, icon, logout }) => {
  const { identity } = useGetIdentity();
  const [anchorEl, setAnchorEl] = useState(null);

  if (!logout && !children) return null;
  const open = Boolean(anchorEl);

  const handleMenu = event => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <Box spacing={2}>
      <Button variant="outlined" onClick={handleMenu} endIcon={<ArrowDropDownIcon />}>
        {identity && identity.fullName ? identity.fullName : 'Anonyme'}
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
        {identity && identity.id !== '' ? (
          logout
        ) : (
          <MenuItemLink to="/login" primaryText="Se connecter" onClick={handleClose} />
        )}
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
