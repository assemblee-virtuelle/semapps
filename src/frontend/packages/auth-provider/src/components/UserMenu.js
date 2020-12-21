import React, { useState } from 'react';
import { useGetIdentity, MenuItemLink } from 'react-admin';
import { Box, Button, Menu } from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import EditIcon from '@material-ui/icons/Edit';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

const UserMenu = ({ logout, children }) => {
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
          <>
            <MenuItemLink
              to={`/User/${encodeURIComponent(identity.id)}/show`}
              primaryText="Voir son profil"
              leftIcon={<AccountCircleIcon />}
              onClick={handleClose}
            />
            <MenuItemLink
              to={`/User/${encodeURIComponent(identity.id)}/edit`}
              primaryText="Editer son profil"
              leftIcon={<EditIcon />}
              onClick={handleClose}
            />
            {logout}
          </>
        ) : (
          <MenuItemLink to="/login" primaryText="Se connecter" onClick={handleClose} />
        )}
      </Menu>
    </Box>
  );
};

export default UserMenu;
