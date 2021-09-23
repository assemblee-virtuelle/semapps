import React, { forwardRef } from 'react';
import { UserMenu as RaUserMenu, MenuItemLink, useGetIdentity } from 'react-admin';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import EditIcon from '@material-ui/icons/Edit';

const ViewProfileMenu = forwardRef(({ onClick, webId }, ref) => (
  <MenuItemLink
    ref={ref}
    to={`/Person/${encodeURIComponent(webId)}/show`}
    primaryText="Voir mon profil"
    leftIcon={<AccountCircleIcon />}
    onClick={onClick}
  />
));

const EditProfileMenu = forwardRef(({ onClick, webId }, ref) => (
  <MenuItemLink
    ref={ref}
    to={`/Person/${encodeURIComponent(webId)}/edit`}
    primaryText="Editer mon profil"
    leftIcon={<EditIcon />}
    onClick={onClick}
  />
));

const LoginMenu = forwardRef(({ onClick }, ref) => (
  <MenuItemLink ref={ref} to="/login" primaryText="Se connecter" onClick={onClick} />
));

const SignupMenu = forwardRef(({ onClick }, ref) => (
  <MenuItemLink ref={ref} to="/login?signup=true" primaryText="Créer un compte" onClick={onClick} />
));

const UserMenu = ({ logout, ...otherProps }) => {
  const { identity } = useGetIdentity();
  return (
    <RaUserMenu {...otherProps}>
      {identity && identity.id !== ''
        ? [
            <ViewProfileMenu webId={identity.id} key="view" />,
            <EditProfileMenu webId={identity.id} key="edit" />,
            React.cloneElement(logout, { key: 'logout' })
          ]
        : [<SignupMenu key="signup" />, <LoginMenu key="login" />]}
    </RaUserMenu>
  );
};

export default UserMenu;
