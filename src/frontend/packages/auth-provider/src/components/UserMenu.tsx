import React, { forwardRef, useCallback } from 'react';
import { Logout, UserMenu as RaUserMenu, useGetIdentity, useTranslate, useUserMenu } from 'react-admin';
import { MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';

// It's important to pass the ref to allow Material UI to manage the keyboard navigation
const UserMenuItem = forwardRef(({ label, icon, to, ...rest }, ref) => {
  const { onClose } = useUserMenu();
  const translate = useTranslate();
  const navigate = useNavigate();
  const onClick = useCallback(() => {
    navigate(to);
    onClose();
  }, [to, onClose, navigate]);
  return (
    <MenuItem
      onClick={onClick}
      ref={ref}
      // It's important to pass the props to allow Material UI to manage the keyboard navigation
      {...rest}
    >
      {icon && <ListItemIcon>{React.cloneElement(icon, { fontSize: 'small' })}</ListItemIcon>}
      <ListItemText>{translate(label)}</ListItemText>
    </MenuItem>
  );
});

const UserMenu = ({ logout, profileResource, ...otherProps }) => {
  const { data: identity } = useGetIdentity();
  return (
    <RaUserMenu {...otherProps}>
      {identity && identity.id !== ''
        ? [
            <UserMenuItem
              key="view"
              label="auth.action.view_my_profile"
              icon={<AccountCircleIcon />}
              to={`/${profileResource || 'Person'}/${encodeURIComponent(
                identity?.profileData?.id || identity.id
              )}/show`}
            />,
            <UserMenuItem
              key="edit"
              label="auth.action.edit_my_profile"
              icon={<EditIcon />}
              to={`/${profileResource || 'Person'}/${encodeURIComponent(identity?.profileData?.id || identity.id)}`}
            />,
            React.cloneElement(logout || <Logout />, { key: 'logout' })
          ]
        : [
            <UserMenuItem key="signup" label="auth.action.signup" to="/login?signup=true" />,
            <UserMenuItem key="login" label="auth.action.login" to="/login" />
          ]}
    </RaUserMenu>
  );
};

export default UserMenu;
